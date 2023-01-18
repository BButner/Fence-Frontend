#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lib::{
    grpc::connect_client,
    state::{FenceState, State},
};
use tauri::{async_runtime::Mutex, Manager};

use crate::lib::commands::{connect_grpc, get_config};

pub mod lib;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut state = FenceState(Mutex::new(State {
        config: None,
        grpc: None,
        grpc_hostname: None,
    }));

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![connect_grpc, get_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
