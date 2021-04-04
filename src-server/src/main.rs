#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{ContentType, Header, Method};
use rocket::{Request, Response};
use std::io::Cursor;

mod form;
mod view;

mod api;
mod db;

mod user;
mod user_api;

mod layout;
mod layout_api;

mod page;
mod page_api;

mod page_connection;
mod page_connection_api;

mod temp_flow;
mod temp_flow_api;

mod schema;

pub struct CORS();

impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to requests",
            kind: Kind::Response,
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));

        if request.method() == Method::Options {
            response.set_header(ContentType::Plain);
            response.set_sized_body(Cursor::new(""));
        }
    }
}

fn main() {
    //embedded_migrations::run_with_output(&db::connect().get().unwrap(), &mut std::io::stdout())
    //    .unwrap();

    rocket::ignite()
        .manage(db::connect())
        .mount(
            "/",
            routes![
                //view::view,
                //view::single_view,
                //view::save_single_view,
                //form::form,
                //form::single_form,
                //form::save_single_form,
                //user_api::users,
                //user_api::create_user,
                //user_api::read_users,
                //user_api::read_user,
                //user_api::update_user,
                //user_api::delete_user,
                layout_api::layouts,
                layout_api::create_layout,
                layout_api::read_layouts,
                layout_api::read_layout,

                page_api::pages,
                page_api::create_page,
                page_api::read_pages,
                page_api::read_page,
                page_api::delete_page,
                page_api::get_page_pk_of_connection,

                page_connection_api::connections,
                page_connection_api::create_page_connection,
                page_connection_api::read_page_connection,

                temp_flow_api::temp_flow,
                temp_flow_api::create_temp_flow,
                temp_flow_api::update_temp_flow,
                temp_flow_api::temp_flow_put_options,
                temp_flow_api::read_temp_flows,
                temp_flow_api::read_temp_flow,

            ],
        )
        .attach(CORS())
        .launch();
}
