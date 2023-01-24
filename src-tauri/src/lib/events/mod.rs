use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventFenceError {
    pub message: String,
    pub title: String,
}
