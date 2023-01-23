use tauri::Manager;

use super::{
    grpc::{connect_client, fence::ConfigResponse, load_config},
    state::{FenceState, State, StateResponse},
};

#[tauri::command]
pub async fn connect_grpc(
    hostname: &str,
    state: tauri::State<'_, FenceState>,
    window: tauri::Window,
) -> Result<bool, ()> {
    let client = connect_client(hostname, window.app_handle()).await;

    if let Some(mut client) = client {
        let mut state = state.0.lock().await;

        let config = load_config(&mut client).await;

        state.grpc = Some(client);
        state.grpc_hostname = Some(hostname.to_string());

        if let Ok(config) = config {
            state.config = Some(config);
        }

        return Ok(true);
    }

    Ok(false)
}

#[tauri::command]
pub async fn get_config(state: tauri::State<'_, FenceState>) -> Result<Option<ConfigResponse>, ()> {
    let state = state.0.lock().await;

    Ok(state.config.clone())
}

#[tauri::command]
pub async fn get_state(state: tauri::State<'_, FenceState>) -> Result<StateResponse, ()> {
    let state = state.0.lock().await;

    Ok(StateResponse {
        grpc_hostname: state.grpc_hostname.clone(),
    })
}
