use log::error;
use rocket_contrib::json::Json;
use serde::Serialize;

use crate::api::ApiError;
use crate::db;
use crate::temp_flow::{NewTempFlow, TempFlow};

#[options("/temp_flow")]
pub fn temp_flow() {}

#[post("/temp_flow", data = "<temp_flow>", format = "json")]
pub fn create_temp_flow(
    temp_flow: Json<NewTempFlow>,
    connection: db::Connection,
) -> Result<Json<TempFlow>, ApiError> {
    TempFlow::create(temp_flow.into_inner(), &connection)
        .map(Json)
        .map_err(|err| {
            error!("Unable to create temp_flow - {}", err);
            ApiError::InternalServerError
        })
}

#[get("/temp_flow")]
pub fn read_temp_flows(connection: db::Connection) -> Result<Json<TempFlowResponse>, ApiError> {
    TempFlow::read_all(&connection)
        .map(|temp_flows| TempFlowResponse { content: temp_flows })
        .map(Json)
        .map_err(|err| {
            error!("Unable to read temp_flows - {}", err);
            ApiError::InternalServerError
        })
}

#[derive(Serialize)]
pub struct TempFlowResponse {
    content: Vec<TempFlow>,
}

#[get("/temp_flow/<temp_flow_pk>")]
pub fn read_temp_flow(temp_flow_pk: i32, connection: db::Connection) -> Result<Json<TempFlow>, ApiError> {
    match TempFlow::read(temp_flow_pk, &connection) {
        Ok(Some(temp_flow)) => Ok(Json(temp_flow)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to read temp_flow - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}
