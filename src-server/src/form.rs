/*
use serde::{Serialize, Deserialize};
use rocket_contrib::json::Json;
use std::error::Error;
use std::fs::File;
use std::path::Path;
use std::io::BufReader;




pub fn read_form_from_file<P: AsRef<Path>>(path: P) -> Result<Grid, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    let u = serde_json::from_reader(reader)?;

    Ok(u)
}

fn save_form_to_file<P: AsRef<Path>>(path: P, view: Grid) -> Result<bool, Box<dyn Error>> {
    serde_json::to_writer(File::create(path)?, &view)?;

    Ok(true)
}

#[get("/form/load/<id>")]
pub fn single_form(id: usize) -> Option<Json<Grid>> {

    match read_form_from_file("./test_form.json") {
        Ok(v) => Some(Json(v)),
        Err(_) => None
    }
}

#[options("/form/save")]
pub fn form() {}


#[post("/form/save", format = "application/json", data = "<view>")]
pub fn save_single_form(view: Json<Grid>)  {
    save_form_to_file(Path::new("./test_form.json"), view.into_inner());
}
*/