//
//  EarthquakeData.swift
//  Earthquake Tracker
//
//  Created by Matthew Vandenberg on 11/2/22.
//

import Foundation
import MapKit

struct RecentEarthquakesJSON: Codable {
    let type: String
    let metadata: RecentEartquakeMetadata
    let features: [RecentEarthquakesItem]
    let bbox: [Double]
}

struct RecentEartquakeMetadata: Codable {
    let generated: CLong
    let url: String
    let title: String
    let status: Int
    let api: String
    let count: Int
}

struct RecentEarthquakesItem: Codable {
    let type: String
    let properties: RecentEarthquake
    let geometry: RecentEarthquakeGeometry
    let id: String
}

struct RecentEarthquake: Codable {
    let mag: Float
    let place: String
    let time: CLong
    let updated: CLong
    let tz: String
    let url: String
    let detail: String
    let felt: String
    let cdi: String
    let mmi: String
    let alert: String
    let status: String
    let tsunami: Int
    let sig: Int
    let net: String
    let dmin: String
    let rms: Float
    let gap: Int
    let magType: String
    let type: String
    let title: String
}

struct RecentEarthquakeGeometry: Codable {
    let type: String
    let coordinate: [Float]
}
