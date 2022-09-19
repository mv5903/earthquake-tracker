import "./App.css";
import Map, { setMapLocation } from "./components/Map";
import RecentEarthquakes from "./components/RecentEarthquakes";
import Settings from "./components/Settings";
import React from "react";
import LocationArrow from "./components/LocationArrow";
import { initApp } from "./assets/Culture";

export default function App() {
    initApp();
    
    return (
        <>
            <Map />
            <RecentEarthquakes changeLocation={setMapLocation}/>
            <Settings />
            <LocationArrow changeLocation={setMapLocation} />
        </>
    );
}
    