#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;


use rocket::{Request, Response};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, ContentType, Method};
use std::io::Cursor;


mod form;
mod view;


#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}


pub struct CORS();

impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to requests",
            kind: Kind::Response
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));

        if request.method() == Method::Options {
            response.set_header(ContentType::Plain);
            response.set_sized_body(Cursor::new(""));
        }        
    }
}


fn main() {
    rocket::ignite()
    .mount("/", routes![
        index, 
        view::view, 
        view::single_view, 
        view::save_single_view,
        form::form,
        form::single_form,
        form::save_single_form
        ])
    .attach(CORS())
    .launch();
}