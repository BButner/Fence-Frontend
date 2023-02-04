use serde::{Deserialize, Serialize};
use tauri::Manager;

use super::{
    grpc::{
        connect_client, disconnect_grpc,
        fence::{ConfigResponse, Monitor},
        load_config,
    },
    state::{FenceState, State, StateResponse},
};

#[tauri::command]
pub async fn connect_grpc(
    hostname: &str,
    state: tauri::State<'_, FenceState>,
    window: tauri::Window,
) -> Result<bool, ()> {
    let mut state = state.0.lock().await;
    state.grpc_hostname = Some(hostname.to_string());
    let client = connect_client(hostname, window.app_handle()).await;

    if let Some(mut client) = client {
        let config = load_config(&mut client).await;

        state.grpc = Some(client);

        if let Ok(config) = config {
            state.config = Some(config);
        }

        return Ok(true);
    }

    Ok(false)
}

#[tauri::command]
pub async fn disconnect(
    state: tauri::State<'_, FenceState>,
    window: tauri::Window,
) -> Result<(), ()> {
    disconnect_grpc(state, window.app_handle()).await;
    Ok(())
}

#[tauri::command]
pub async fn select_monitor(
    monitor: Monitor,
    state: tauri::State<'_, FenceState>,
) -> Result<Monitor, ()> {
    let mut state = state.0.lock().await;

    if let Some(client) = &mut state.grpc {
        let response = client.toggle_monitor_selected(monitor).await;

        if let Ok(response) = response {
            return Ok(response.into_inner());
        }
    }

    Err(())
}

#[tauri::command]
pub async fn get_config(
    state: tauri::State<'_, FenceState>,
) -> Result<Option<GetConfigResponse>, ()> {
    let state = state.0.lock().await;

    if let Some(config) = &state.config {
        return Ok(Some(GetConfigResponse {
            lock_by_default: config.lock_by_default,
            monitors: config.monitors.clone(),
        }));
    } else {
        return Ok(None);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GetConfigResponse {
    #[serde(rename(serialize = "lockByDefault"))]
    lock_by_default: bool,
    monitors: Vec<Monitor>,
}

#[tauri::command]
pub async fn get_state(state: tauri::State<'_, FenceState>) -> Result<StateResponse, ()> {
    let state = state.0.lock().await;

    Ok(StateResponse {
        grpc_hostname: state.grpc_hostname.clone(),
    })
}
