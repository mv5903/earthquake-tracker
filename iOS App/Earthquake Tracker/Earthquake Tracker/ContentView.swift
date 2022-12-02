//
//  ContentView.swift
//  Earthquake Tracker
//
//  Created by Matthew Vandenberg on 11/2/22.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            EarthquakeMap()
                .edgesIgnoringSafeArea(.all)
            RecentEarthquakePanel()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
