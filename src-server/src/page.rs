use diesel::{self, QueryDsl};
use diesel::pg::PgConnection;
use serde::{Deserialize, Serialize};
use crate::{schema::pages};
use chrono::NaiveDateTime;
use diesel::RunQueryDsl;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(pk_id)]
#[table_name = "pages"]
pub struct Page {
    pub pk_id: i32,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub fk_layout_id: i32,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "pages"]
pub struct NewPage<'a>
{
    pub page_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
}

impl Page {

    pub fn create(page: NewPage, connection: &PgConnection) -> Result<Page, String> {
        diesel::insert_into(pages::table)
            .values(&page)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<Page>, String> {
        pages::table
            .order(pages::pk_id)
            .load::<Page>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(pk_id: i32, connection: &PgConnection) -> Result<Option<Page>, String> {
        match pages::table.find(pk_id).first(connection) {
            Ok(page) => Ok(Some(page)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }
    /*
    pub fn update(_: i32, user: User, connection: &PgConnection) -> Result<Option<User>, String> {
        let update_result = diesel::update(&user)
            .set(&user)
            .execute(connection);

        match update_result {
            Err(diesel::result::Error::NotFound) | Ok(0) => Ok(None),
            Err(err) => Err(err.to_string()),
            Ok(_) => Ok(Some(user)),
        }
    }
*/
    pub fn delete(pk_id: i32, connection: &PgConnection) -> Result<bool, String> {
        diesel::delete(pages::table.find(pk_id))
            .execute(connection)
            .map(|aff_rows| aff_rows > 0)
            .map_err(|err| err.to_string())
    }

}

/*/
#[cfg(test)]
mod tests {
  use super::*;

  mod db;

  #[test]
  fn create_valid_page() {

    use crate::page::{NewPage};
    use chrono::{NaiveDate, NaiveDateTime};
    let dt: NaiveDateTime = NaiveDate::from_ymd(2016, 7, 8).and_hms(9, 10, 11);

    db::connect();


    let page = NewPage {
     page_id: "",
     name: "",
     created_at: dt
    };
  }
}
*/
