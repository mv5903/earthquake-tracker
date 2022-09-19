import * as mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { useRef, useEffect } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import { getLocale } from "../assets/Culture"; 
import { getEarthquakePopup } from "./Earthquake";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = "pk.eyJ1Ijoia3dpa21hdHQiLCJhIjoiY2ticmhpMjQ1MndvbjJwcW54bmk1dWFjdCJ9.nVMk6GxrstG-4QIeX1y33g";

/**********************************************************************************************************************/

let map = null;

export default function Map() {
    const mapContainer = useRef(null);
    map = useRef(null);

    // Default Map Starting Position
    const lng = -137;
    const lat = 31;
    const zoom = 4;

    useEffect(() => {
        fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
            .then(response => response.json())
            .then(data => {
                organizeData(data);
                if (map.current) return;
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/mapbox/dark-v10",
                    center: [lng, lat],
                    zoom: zoom,
                });
                const currentLocale = getLocale();
                const language = new MapboxLanguage({ defaultLanguage: currentLocale });
                map.current.addControl(language);
                map.current.on("load", () => {
                    // Add a new source from our GeoJSON data and
                    // set the 'cluster' option to true. GL-JS will
                    // add the point_count property to your source data.
                    map.current.addSource("earthquakes", {
                        type: "geojson",
                        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                        data: data,
                        cluster: true,
                        clusterMaxZoom: 10, // Max zoom to cluster points on
                        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
                    });

                    map.current.addLayer({
                        id: "clusters",
                        type: "circle",
                        source: "earthquakes",
                        filter: ["has", "point_count"],
                        paint: {
                            "circle-color": [
                                "step",
                                ["get", "point_count"],
                                "#51bbd6",
                                100,
                                "#f1f075",
                                750,
                                "#f28cb1",
                            ],
                            "circle-radius": [
                                "step",
                                ["get", "point_count"],
                                20,
                                100,
                                30,
                                750,
                                40,
                            ],
                        },
                    });

                    map.current.addLayer({
                        id: "cluster-count",
                        type: "symbol",
                        source: "earthquakes",
                        filter: ["has", "point_count"],
                        layout: {
                            "text-field": "{point_count_abbreviated}",
                            "text-font": [
                                "DIN Offc Pro Medium",
                                "Arial Unicode MS Bold",
                            ],
                            "text-size": 12,
                        },
                    });

                    map.current.addLayer({
                        id: "unclustered-point",
                        type: "circle",
                        source: "earthquakes",
                        filter: ["!", ["has", "point_count"]],
                        paint: {
                            "circle-color": "#11b4da",
                            "circle-radius": 4,
                            "circle-stroke-width": 1,
                            "circle-stroke-color": "#fff",
                        },
                    });

                    // inspect a cluster on click
                    map.current.on("click", "clusters", (e) => {
                        const features = map.current.queryRenderedFeatures(
                            e.point,
                            {
                                layers: ["clusters"],
                            }
                        );
                        const clusterId = features[0].properties.cluster_id;
                        map.current
                            .getSource("earthquakes")
                            .getClusterExpansionZoom(clusterId, (err, zoom) => {
                                if (err) return;
                                map.current.easeTo({
                                    center: features[0].geometry.coordinates,
                                    zoom: zoom,
                                });
                            });
                    });

                    map.current.on("click", "unclustered-point", (e) => {
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] +=
                                e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(getEarthquakePopup(e.features[0]))
                            .addTo(map.current);
                    });

                    map.current.on("mouseenter", "clusters", () => {
                        map.current.getCanvas().style.cursor = "pointer";
                    });
                    map.current.on("mouseleave", "clusters", () => {
                        map.current.getCanvas().style.cursor = "";
                    });
                }) 
            });
    }, [lng, lat]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

function organizeData(data) {
    data.features.forEach((feature) => {
        feature.properties.mag = feature.properties.mag.toFixed(2);
    });
}

export function setMapLocation(lat, long, clickedOn) {
    if (!map.current) return;
    map.current.flyTo({
        center: [lat, long],
        zoom: 12,
    });
    
    map.current.on('moveend', () => {
        map.current.queryRenderedFeatures( { layers: ['unclustered-point'] } ).forEach((feature) => {
            if (feature.properties.code === clickedOn.properties.code) {
                document.querySelectorAll('.mapboxgl-popup').forEach(popup => popup.remove());
                new mapboxgl.Popup()
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML(getEarthquakePopup(clickedOn))
                    .addTo(map.current);
            }
        });
    });
}