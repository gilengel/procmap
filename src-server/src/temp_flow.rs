use diesel::{self};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::temp_flow;
use chrono::NaiveDateTime;

use serde_json::Value;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(flow_pk)]
#[table_name = "temp_flow"]
pub struct TempFlow {
    flow_pk: i32,
    flow_id: String,
    name: String,
    created_at: NaiveDateTime,
    data: Value,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "temp_flow"]
pub struct NewTempFlow<'a>
{
    pub flow_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

impl TempFlow {

    pub fn create(tempFlow: NewTempFlow, connection: &PgConnection) -> Result<TempFlow, String> {
        diesel::insert_into(temp_flow::table)
            .values(&tempFlow)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<TempFlow>, String> {
        temp_flow::table
            .order(temp_flow::flow_pk)
            .load::<TempFlow>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(flow_pk: i32, connection: &PgConnection) -> Result<Option<TempFlow>, String> {
        match temp_flow::table.find(flow_pk).first(connection) {
            Ok(temp_flow) => Ok(Some(temp_flow)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }
}
