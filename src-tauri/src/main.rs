// Prevents additional console window on Windows in release, DO NOT REMOVE!!
//#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Ws;
use surrealdb::Surreal;
// use std::collections::HashSet;
// use tokio::time::{interval, Duration};
// use reqwest::Error;

// Used for the locations
#[derive(Debug, Deserialize, Serialize)]
struct CentreForLocation {
    coordinates: Vec<f64>,
    description: String,
}

// Used for the flights
#[derive(Debug, Deserialize, Serialize)]
struct CentreForFlight {
    coordinates: Vec<f64>,
    description: Description,
}

#[derive(Debug, Deserialize, Serialize)]
struct Location {
    centre: CentreForLocation,
}

#[derive(serde::Serialize)]
struct Coordinate {
    latitude: f64,
    longitude: f64,
    description: String,
}

#[derive(Debug, Deserialize)]
struct Flight {
    centre: CentreForFlight,
}

#[derive(Debug, Serialize, Deserialize)]
struct Description {
    flight_number: String,
    registration: Option<String>,
    destination: Option<String>,
}

#[derive(Debug, Serialize)]
struct FlightCoordinate {
    latitude: f64,
    longitude: f64,
    description: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// async fn start_background_tasks() {
//     let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(3600)); // Run every hour
     
//     loop {
//         interval.tick().await;
//         match fetch_and_store_coordinates().await {
//             Ok(_) => println!("Data updated successfully!"),
//             Err(e) => eprintln!("Error updating data: {}", e),
//         }
//     }
// }


// async fn fetch_and_store_coordinates() -> Result<(), String> {
//     // Fetch data from the external API
//     let coordinates = get_coordinates().await?;

//     // Connect to the SurrealDB
//     let db = Surreal::new::<Ws>("127.0.0.1:8000").await.map_err(|e| e.to_string())?;
//     db.use_ns("test").use_db("test").await.map_err(|e| e.to_string())?;

//     // Retrieve all existing locations from the database
//     let existing_locations: Vec<Location> = db.select("locations").await.map_err(|e| e.to_string())?;

//     // Convert existing locations to a HashSet for faster lookup
//     let existing_descriptions: HashSet<String> = existing_locations
//         .iter()
//         .map(|location| location.centre.description.clone())
//         .collect();

//     // Insert each Coordinate into the database if it doesn't already exist
//     for coord in coordinates {
//         if !existing_descriptions.contains(&coord.description) {
//             let location = Location {
//                 centre: Centre {
//                     coordinates: vec![coord.longitude, coord.latitude],
//                     description: coord.description.clone(),
//                 },
//             };

//             let result: Result<Vec<Location>, _> = db.create("locations").content(&location).await;

//             match result {
//                 Ok(_) => {},
//                 Err(e) => return Err(e.to_string()),
//             }         
//             //db.create("locations").content(&location).await.map_err(|e| e.to_string())?;

//         }
//     }

//     Ok(())
// }

// async fn get_coordinates() -> Result<Vec<Coordinate>, String> {
//     let url = "https://restcountries.com/v3.1/all";
    
//     let response: Vec<Country> = reqwest::get(url)
//         .await
//         .map_err(|e| e.to_string())?
//         .json()
//         .await
//         .map_err(|e| e.to_string())?;
    
//     let coordinates: Vec<Coordinate> = response.into_iter()
//         .filter_map(|country| {
//             country.latlng.and_then(|latlng| {
//                 if latlng.len() == 2 {
//                     Some(Coordinate {
//                         latitude: latlng[0],
//                         longitude: latlng[1],
//                         description: country.name.common
//                     })
//                 } else {
//                     None
//                 }
//             })
//         })
//         .collect();

//     Ok(coordinates)
// }

#[tauri::command]
async fn get_geocoordinates() -> Result<Vec<Coordinate>, String> {
    // Connect to the server
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await.map_err(|e| e.to_string())?;
    
    // Select the namespace and database
    db.use_ns("test").use_db("test").await.map_err(|e| e.to_string())?;
    
    // Retrieve all locations from the database
    let locations: Vec<Location> = db.select("locations").await.map_err(|e| e.to_string())?;
    
    // Convert the locations to the Coordinate format
    let coordinates: Vec<Coordinate> = locations.into_iter().map(|location| {
        let coords = &location.centre.coordinates;
        Coordinate {
            latitude: coords[1],
            longitude: coords[0],
            description: location.centre.description.clone()
        }
    }).collect();
    
   //println!("Fetched and transformed data from SurrealDB: {:?}", coordinates);

    Ok(coordinates)
}

#[tauri::command]
async fn get_flight_coordinates() -> Result<Vec<FlightCoordinate>, String> {
    // Connect to the server
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await.map_err(|e| e.to_string())?;
    
    // Select the namespace and database
    db.use_ns("test").use_db("test").await.map_err(|e| e.to_string())?;
    
    // Retrieve all flights from the database
    let flights: Vec<Flight> = db.select("flights").await.map_err(|e| e.to_string())?;
    
    let flight_coordinates: Vec<FlightCoordinate> = flights.into_iter().map(|flight| {
        FlightCoordinate {
            latitude: flight.centre.coordinates[1],
            longitude: flight.centre.coordinates[0],
            description: format!("Flight Number: {}, Registration: {}, Destination: {}", flight.centre.description.flight_number, flight.centre.description.registration.unwrap_or("N/A".to_string()), flight.centre.description.destination.unwrap_or("N/A".to_string()))
        }
    }).collect();

    //println!("Fetched and transformed data from SurrealDB: {:?}", flight_coordinates);

    Ok(flight_coordinates)
}

#[tauri::command]
async fn process_user_query(query: String) -> Result<String, String> {
   
    Ok(format!("Hello from Rust backend! Your query was: {}", query))

}

// #[derive(serde::Deserialize)]
// struct Country {
//     name: Name,
//     latlng: Option<Vec<f64>>,
// }

// #[derive(serde::Deserialize)]
// struct Name {
//     common: String,
// }


fn main() {

    // let runtime = tokio::runtime::Builder::new_multi_thread()
    //     .enable_all()
    //     .build()
    //     .unwrap();

    // runtime.spawn(async {
    //     let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(3600)); // Run every hour

    //     loop {
    //         interval.tick().await;
    //         match fetch_and_store_coordinates().await {
    //             Ok(_) => println!("Data updated successfully!"),
    //             Err(e) => eprintln!("Error updating data: {}", e),
    //         }
    //     }
    // });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_geocoordinates, get_flight_coordinates, process_user_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


