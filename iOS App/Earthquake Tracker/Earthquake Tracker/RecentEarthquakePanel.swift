//
//  RecentEarthquakePanel.swift
//  Earthquake Tracker
//
//  Created by Matthew Vandenberg on 11/4/22.
//

import Foundation
import SwiftUI

struct RecentEarthquakePanel : View {
    @State var isPresented = false;
    var body: some View {
        ZStack {
            HStack {
                Text("Recent Earthquakes")
                    .fontWeight(Font.Weight.heavy)
                Image(systemName: isPresented ? "chevron.up" : "chevron.down")
            }
                .font(.system(size: 32))
                .position(x: 215, y: 25)
                .cornerRadius(18)
                .onTapGesture(count: 1) {
                    isPresented = !isPresented;
                }
            
        }
    }
}
