use serde::{Deserialize, Serialize};
use tauri::async_runtime::Mutex;
use tonic::transport::Channel;

use super::grpc::fence::{fence_manager_client::FenceManagerClient, ConfigResponse};

pub struct FenceState(pub Mutex<State>);

#[derive(Clone, Debug)]
pub struct State {
    pub config: Option<ConfigResponse>,
    pub grpc: Option<FenceManagerClient<Channel>>,
    pub grpc_hostname: Option<String>,
}
