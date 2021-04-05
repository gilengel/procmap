
use log::error;
use rocket_contrib::json::Json;
use serde::Serialize;

use crate::api::ApiError;
use crate::db;
use crate::page::{NewPage, Page, PageConnectionIds};
use rocket::http::RawStr;

#[options("/pages")]
pub fn pages() {}

#[post("/pages", data = "<pages>", format = "json")]
pub fn create_page(
    pages: Json<Vec<NewPage>>,
    connection: db::Connection,
) -> Result<Json<Vec<Page>>, ApiError> {
    Page::create(&pages.into_inner(), &connection)
        .map(Json)
        .map_err(|err| {
            error!("Unable to create page - {}", err);
            ApiError::InternalServerError
        })
}

/*
#[get("/pages/connection_pks/<previous_uuid>/<next_uuid>")]
pub fn get_page_pk_of_connection(
    previous_uuid: String,
    next_uuid: String,
    connection: db::Connection,
) -> Result<Json<Vec<i32>>, ApiError> {
    Page::extract_pk_for_connection(previous_uuid, next_uuid, &connection)
        .map(Json)
        .map_err(|err| {
            error!("Unable to create page - {}", err);
            ApiError::InternalServerError
        })
}
*/

#[get("/pages")]
pub fn read_pages(connection: db::Connection) -> Result<Json<PagesResponse>, ApiError> {
    Page::read_all(&connection)
        .map(|pages| PagesResponse { content: pages })
        .map(Json)
        .map_err(|err| {
            error!("Unable to read pages - {}", err);
            ApiError::InternalServerError
        })
}

#[derive(Serialize)]
pub struct PagesResponse {
    content: Vec<Page>,
}

#[get("/pages/<page_id>")]
pub fn read_page(page_id: i32, connection: db::Connection) -> Result<Json<Page>, ApiError> {
    match Page::read(page_id, &connection) {
        Ok(Some(page)) => Ok(Json(page)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to read page - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}

#[get("/pages/current/<page_id>")]
pub fn read_current_page_by_id(page_id: &RawStr, connection: db::Connection) -> Result<Json<Page>, ApiError> {
    match Page::read_latest(page_id.to_string(), &connection) {
        Ok(Some(page)) => Ok(Json(page)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to read page - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}

#[get("/pages/following/<page_id>")]
pub fn read_following_pages_for_connection(page_id: String, connection: db::Connection) -> Result<Json<Vec<PageConnectionIds>>, ApiError> {
  match Page::read_following_page_ids(page_id, &connection) {
    Ok(Some(ids)) => Ok(Json(ids)),
    Ok(None) => Err(ApiError::NotFound),
    Err(err) => {
      error!("Unable to read following page ids - {}", err);
      Err(ApiError::InternalServerError)
    }
  }
}

#[get("/pages/previous/<page_id>")]
pub fn read_previous_pages_for_connection(page_id: String, connection: db::Connection) -> Result<Json<Vec<PageConnectionIds>>, ApiError> {
  match Page::read_previous_page_ids(page_id, &connection) {
    Ok(Some(ids)) => Ok(Json(ids)),
    Ok(None) => Err(ApiError::NotFound),
    Err(err) => {
      error!("Unable to read previous page ids - {}", err);
      Err(ApiError::InternalServerError)
    }
  }
}

#[delete("/pages/<page_id>")]
pub fn delete_page(page_id: i32, connection: db::Connection) -> Result<(), ApiError> {
    match Page::delete(page_id, &connection) {
        Ok(true) => Ok(()),
        Ok(false) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to delete page - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}
