fn main() -> Result<(), Box<dyn std::error::Error>> {
    // tonic_build::compile_protos("proto/fence.proto")?;
    tonic_build::configure()
        .build_server(false)
        .type_attribute(
            "ConfigResponse",
            "#[derive(serde::Deserialize, serde::Serialize)]",
        )
        .type_attribute("Monitor", "#[derive(serde::Deserialize, serde::Serialize)]")
        .type_attribute(
            "CursorLocation",
            "#[derive(serde::Deserialize, serde::Serialize)]",
        )
        .compile(&["proto/fence.proto"], &["fence"])?;
    tauri_build::build();
    Ok(())
}
