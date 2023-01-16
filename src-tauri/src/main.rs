#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lib::{
    grpc::connect_client,
    state::{FenceState, State},
};
use tauri::{async_runtime::Mutex, Manager};

#[tauri::command]
async fn test_connect(
    hostname: &str,
    state: tauri::State<'_, FenceState>,
    window: tauri::Window,
) -> Result<bool, ()> {
    let client = connect_client(hostname, window.app_handle()).await;

    if let Some(client) = client {
        let mut state = state.0.lock().await;

        state.grpc = Some(client);

        return Ok(true);
    }

    Ok(false)
}

pub mod lib;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut state = FenceState(Mutex::new(State {
        config: None,
        grpc: None,
    }));
    tauri::Builder::default()
        .setup(|app| {
            // let app_handle = app.handle();

            // tokio::spawn(async move {
            //     let mut state = State {
            //         config: None,
            //         grpc: None,
            //     };

            //     let client = connect_client().await;

            //     if let Some(client) = client {
            //         let mut client_clone = client.clone();

            //         state.grpc = Some(client);
            //         app_handle.emit_all("grpc-connected", {})

            //         start_mouse_listener(&mut client_clone).await;

            //         app_handle.emit_all("grpc-disconnected", {});
            //     }

            //     app_handle.manage(Mutex::new(state));
            // });

            Ok(())
        })
        .manage(state)
        .invoke_handler(tauri::generate_handler![test_connect])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
