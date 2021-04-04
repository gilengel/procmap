use crate::schema::pages;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::RunQueryDsl;
use diesel::{self, QueryDsl};
use serde::{Deserialize, Serialize};
use diesel::expression_methods::ExpressionMethods;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(page_pk)]
#[table_name = "pages"]
pub struct Page {
    pub page_pk: i32,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    //pub fk_layout_pk: i32,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "pages"]
pub struct NewPage<'a> {
    pub page_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
}

impl Page {
    pub fn create(page: &Vec<NewPage>, connection: &PgConnection) -> Result<Vec<Page>, String> {
        diesel::insert_into(pages::table)
            .values(page)
            .get_results(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<Page>, String> {
        pages::table
            .order(pages::page_pk)
            .load::<Page>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(page_pk: i32, connection: &PgConnection) -> Result<Option<Page>, String> {
        match pages::table.find(page_pk).first(connection) {
            Ok(page) => Ok(Some(page)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }

    pub fn extract_pk_for_connection(previous_uuid: String, next_uuid: String, connection: &PgConnection) -> Result<Vec<i32>, String> {
        pages::table
            .select(pages::page_pk)
            .filter(pages::page_id.eq_any(vec![previous_uuid, next_uuid]))
            .load::<i32>(&connection as &PgConnection)
            .map_err(|err| err.to_string())
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
