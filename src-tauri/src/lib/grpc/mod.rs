use std::{sync::MutexGuard, time::Duration};

use tauri::{AppHandle, Manager};
use tonic::{
    transport::{channel, Channel},
    Request,
};

use crate::lib::events::EventFenceError;

use self::fence::{fence_manager_client::FenceManagerClient, ConfigResponse, Monitor};

use super::state::{FenceState, State};

pub mod fence {
    tonic::include_proto!("fence");
}

static mut CURSOR_LOOP_HANDLE: Option<tokio::task::JoinHandle<()>> = None;
static mut HEARTBEAT_LOOP_HANDLE: Option<tokio::task::JoinHandle<()>> = None;

pub async fn connect_client(
    hostname: &str,
    app_handle: AppHandle,
) -> Option<FenceManagerClient<Channel>> {
    let client_hostname = hostname.clone();

    let shared_channel = Channel::from_shared(hostname.to_string());

    match shared_channel {
        Ok(channel) => {
            println!("channel: {:?}", channel);
            let channel = channel
                .connect_timeout(Duration::from_secs(5))
                .connect()
                .await;
            println!("after connect: {:?}", channel);

            match channel {
                Ok(channel) => {
                    let client = FenceManagerClient::new(channel);

                    let clone = client.clone();
                    let mut heartbeat_client = client.clone();
                    let hostname_clone = hostname.clone().to_string();
                    let mut app_handle_clone = app_handle.clone();

                    unsafe {
                        if let Some(cursor_loop_handle) = &CURSOR_LOOP_HANDLE {
                            cursor_loop_handle.abort();
                        }

                        if let Some(heartbeat_loop_handle) = &HEARTBEAT_LOOP_HANDLE {
                            heartbeat_loop_handle.abort();
                        }

                        CURSOR_LOOP_HANDLE = Some(tokio::task::spawn(async move {
                            start_mouse_listener(&mut client.clone(), &mut app_handle_clone).await;
                        }));

                        HEARTBEAT_LOOP_HANDLE = Some(tokio::task::spawn(async move {
                            &app_handle.emit_all("grpc-connected", hostname_clone);
                            println!("connected");

                            start_heartbeat_listener(&mut heartbeat_client, &app_handle).await;

                            &app_handle.emit_all("grpc-disconnected", {});

                            let state = &app_handle.state::<FenceState>();
                            let mut state = state.0.lock().await;
                            state.grpc = None;
                            state.grpc_hostname = None;

                            println!("disconnected");
                        }));
                    }

                    Some(clone)
                }
                Err(e) => {
                    println!("error connecting 1: {:?}", e);
                    println!("{}", e.to_string());
                    &app_handle.emit_all("grpc-connection-failed", {});
                    &app_handle.emit_all(
                        "fence-error",
                        EventFenceError {
                            message: "Failed to connect to ".to_string()
                                + client_hostname
                                + ". Reason: "
                                + &e.to_string(),
                            title: "Error Connecting".to_string(),
                        },
                    );
                    None
                }
            }
        }
        Err(e) => {
            println!("error connecting: {:?}", e);
            println!("{}", e.to_string());
            None
        }
    }
}

pub async fn load_config(
    client: &mut FenceManagerClient<Channel>,
) -> Result<ConfigResponse, Box<dyn std::error::Error>> {
    let config = client.get_config(()).await?;

    Ok(config.into_inner())
}

pub async fn select_monitor(
    client: &mut FenceManagerClient<Channel>,
    monitor: Monitor,
) -> Result<Monitor, Box<dyn std::error::Error>> {
    let response = client.toggle_monitor_selected(monitor).await?;

    println!("response: {:?}", response);

    Ok(response.into_inner())
}

pub async fn disconnect_grpc(state: tauri::State<'_, FenceState>, app_handle: AppHandle) {
    unsafe {
        if let Some(cursor_loop_handle) = &CURSOR_LOOP_HANDLE {
            cursor_loop_handle.abort();
        }

        if let Some(heartbeat_loop_handle) = &HEARTBEAT_LOOP_HANDLE {
            heartbeat_loop_handle.abort();
        }

        CURSOR_LOOP_HANDLE = None;
        HEARTBEAT_LOOP_HANDLE = None;

        let mut state = state.0.lock().await;
        state.grpc = None;
        state.grpc_hostname = None;

        &app_handle.emit_all("grpc-disconnected", {});
    }
}

async fn start_mouse_listener(
    client: &mut FenceManagerClient<Channel>,
    app_handle: &mut AppHandle,
) {
    let stream_result = client.get_cursor_location_stream(()).await;

    match stream_result {
        Ok(mut response) => {
            let stream = response.get_mut();

            loop {
                let message = stream.message().await;

                match message {
                    Ok(message) => {
                        if message.is_none() {
                            break;
                        }

                        app_handle.emit_all("mouse-location", message.unwrap());
                    }
                    Err(e) => println!("message err {:?}", e),
                }
            }
        }
        Err(e) => println!("error mouse listener: {:?}", e),
    }
}

async fn start_heartbeat_listener(
    client: &mut FenceManagerClient<Channel>,
    app_handle: &AppHandle,
) {
    let mut stream_result = client.get_heartbeat_stream(()).await;

    match stream_result {
        Ok(mut response) => {
            let stream = response.get_mut();

            loop {
                let message = stream.message().await;

                match message {
                    Ok(message) => {
                        if message.is_none() {
                            break;
                        }

                        app_handle.emit_all("heartbeat", message.unwrap());
                    }
                    Err(e) => println!("message err {:?}", e),
                }
            }
        }
        Err(e) => println!("error heartbeat listener: {:?}", e),
    }
}
