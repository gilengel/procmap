use diesel::{self, sql_types::Json};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::layouts;

extern crate chrono;
use chrono::NaiveDateTime;

use serde_json::Value;

/*
#[derive(Serialize, Deserialize, Debug)]
pub enum ElementType {
    Button,
    Text
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ElementAttributeType {
    Number,
    String,
    Boolean
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ElementAttribute {
    name: String,
    r#type: ElementAttributeType,
    value: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    uuid: String,
    r#type: ElementType,
    attributes: Vec<ElementAttribute>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Column {
    width: u16,

    #[serde(default)]
    element: Option<Element>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Row {
    columns: Vec<Column>
}

#[derive(FromSqlRow, AsExpression, Serialize, Deserialize, Debug, Default)]
#[sql_type = "Json"]
pub struct Grid {
    rows: Vec<Row>
}
*/



#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(id)]
pub struct Layout {
    pub id: i32,
    pub layout_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "layouts"]
pub struct NewLayout<'a>
{
    pub layout_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

impl Layout {
    
    pub fn create(layout: NewLayout, connection: &PgConnection) -> Result<Layout, String> {
        diesel::insert_into(layouts::table)
            .values(&layout)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }
    
    pub fn read_all(connection: &PgConnection) -> Result<Vec<Layout>, String> {
        layouts::table
            .order(layouts::id)
            .load::<Layout>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(id: i32, connection: &PgConnection) -> Result<Option<Layout>, String> {
        match layouts::table.find(id).first(connection) {
            Ok(layout) => Ok(Some(layout)),
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

    pub fn delete(id: i32, connection: &PgConnection) -> Result<bool, String> {
        diesel::delete(users::table.find(id))
            .execute(connection)
            .map(|aff_rows| aff_rows > 0)
            .map_err(|err| err.to_string())
    }
    */
}
