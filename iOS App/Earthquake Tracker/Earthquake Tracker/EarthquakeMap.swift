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
        center: CLLocationCoordinate2D(latitude: 37.3, longitude: -122),
        latitudinalMeters: 750,
        longitudinalMeters: 750
    );
    
    var body: some View {
        Map(coordinateRegion: $region)
    }
}
