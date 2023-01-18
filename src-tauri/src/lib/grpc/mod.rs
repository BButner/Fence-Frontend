use std::sync::MutexGuard;

use tauri::{AppHandle, Manager};
use tonic::transport::{channel, Channel};

use self::fence::{fence_manager_client::FenceManagerClient, ConfigResponse};

use super::state::{FenceState, State};

pub mod fence {
    tonic::include_proto!("fence");
}

static mut LOOP_HANDLE: Option<tokio::task::JoinHandle<()>> = None;

pub async fn connect_client(
    hostname: &str,
    app_handle: AppHandle,
) -> Option<FenceManagerClient<Channel>> {
    let client = FenceManagerClient::connect(hostname.to_string()).await;

    return match client {
        Ok(client) => {
            app_handle.emit_all("grpc-connected", { hostname });
            println!("connected");

            let clone = client.clone();

            unsafe {
                if let Some(loop_handle) = &LOOP_HANDLE {
                    loop_handle.abort();
                }

                LOOP_HANDLE = Some(tokio::task::spawn(async move {
                    start_mouse_listener(&mut client.clone(), app_handle.clone()).await;
                    app_handle.emit_all("grpc-disconnected", {});
                    println!("disconnected");
                }));
            }

            Some(clone)
        }
        Err(e) => {
            println!("error connecting: {:?}", e);
            println!("{}", e.to_string());
            return None;
        }
    };
}

pub async fn load_config(
    client: &mut FenceManagerClient<Channel>,
) -> Result<ConfigResponse, Box<dyn std::error::Error>> {
    let config = client.get_config(()).await?;

    Ok(config.into_inner())
}

async fn start_mouse_listener(client: &mut FenceManagerClient<Channel>, app_handle: AppHandle) {
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
