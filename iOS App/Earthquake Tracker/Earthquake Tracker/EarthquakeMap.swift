//
//  Map.swift
//  Earthquake Tracker
//
//  Created by Matthew Vandenberg on 11/2/22.
//

import Foundation
import MapKit
import SwiftUI

struct EarthquakeMap: View {
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 42, longitude: -120),
        latitudinalMeters: 1000000,
        longitudinalMeters: 1000000
    );
    @State var results = [RecentEarthquakesJSON]()
    
    var body: some View {
        Map(coordinateRegion: $region)
    }
    
    
    func loadData() -> String {
            guard let url = URL(string: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson") else {
                print("Invalid URL")
                return "NO DATA"
            }
            let request = URLRequest(url: url)

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    if let response = try? JSONDecoder().decode([RecentEarthquakesJSON].self, from: data) {
                        DispatchQueue.main.async {
                            self.results = response
                        }
                        return
                    }
                }
                print(data)
            }.resume()
            return "TEST"
        }
}
