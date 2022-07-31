import './App.css';
import RecentEarthquakes from './components/RecentEarthquakes'
import 'mapbox-gl/dist/mapbox-gl.css';
import Settings from './components/Settings';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'
import { SETTINGS } from './assets/settings';
import { LANGUAGE } from './assets/localization'; 
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
mapboxgl.accessToken = "pk.eyJ1Ijoia3dpa21hdHQiLCJhIjoiY2ticmhpMjQ1MndvbjJwcW54bmk1dWFjdCJ9.nVMk6GxrstG-4QIeX1y33g"
const moment = require('moment')

export default function App() {

  if (!localStorage.getItem('userData')) {
    let userData = {};
    SETTINGS.forEach(setting => userData[setting.settingName] = setting.value)
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // For auto localization
  Object.defineProperty(String.prototype, "_", {
    value: function _() {
      const USER = JSON.parse(localStorage.getItem('userData'));
      try {
        return LANGUAGE[USER.language][this];
      } catch (e) {
        return '?';
      }
    },
    writable: true,
    configurable: true,
  });

  const mapContainer = useRef(null);
  const map = useRef(null);

  const lng = -137;
  const lat = 31;
  const zoom = 4;


  function setLongLat(long, lat) {
    map.current.flyTo({
      center: [lat, long],
      zoom: 8
    })
  }

  const [siteData, setSiteData] = useState([])

  useEffect(() => {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      .then(response => response.json())
      .then(data => {
        setSiteData(data)
        data = organizeData(data)
        if (map.current) return;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [lng, lat],
          zoom: zoom
        })
        map.current.on('load', () => {
          // Add a new source from our GeoJSON data and
          // set the 'cluster' option to true. GL-JS will
          // add the point_count property to your source data.
          map.current.addSource('earthquakes', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: data,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
          });

          map.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            paint: {
              // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
              // with three steps to implement three types of circles:
              //   * Blue, 20px circles when point count is less than 100
              //   * Yellow, 30px circles when point count is between 100 and 750
              //   * Pink, 40px circles when point count is greater than or equal to 750
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
              ]
            }
          });

          map.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
            }
          });

          map.current.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 4,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff'
            }
          });

          // inspect a cluster on click
          map.current.on('click', 'clusters', (e) => {
            const features = map.current.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.current.getSource('earthquakes').getClusterExpansionZoom(
              clusterId,
              (err, zoom) => {
                if (err) return;

                map.current.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
          });

          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          map.current.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const mag = e.features[0].properties.mag;
            const tsunami =
              e.features[0].properties.tsunami === 1 ? 'Yes'._() : 'No'._();
            const title = e.features[0].properties.title.substring(e.features[0].properties.title.indexOf('-') + 2)
            const localUser = JSON.parse(localStorage.getItem('userData'))
            const USER = localUser
            const timeFormat = USER.timeFormat === '24-Hour' ? 'HH:mm' : 'h:mm a';
            const TIMESTAMP = moment(e.features[0].properties.time).tz(USER.timeZone).format(`${USER.dateFormat} ${timeFormat}`) + ' ' + moment.tz(USER.timeZone).zoneAbbr();
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `<h3 style="text-align:center">${title}</h3>${TIMESTAMP}<br>${"Magnitude"._()}: ${mag}<br>${"Tsunami"._()}: ${tsunami}`
              )
              .addTo(map.current);
          });

          map.current.on('mouseenter', 'clusters', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });
          map.current.on('mouseleave', 'clusters', () => {
            map.current.getCanvas().style.cursor = '';
          });

    
        });
      })
      .catch(error => console.error(error.message))
  }, [lng, lat])

  return (
    <>
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
      <RecentEarthquakes changeLocation={setLongLat} data={siteData} />
      <Settings />
    </>
  );
}


// CLean up some of the data from the API
function organizeData(data) {
  data.features.forEach(feature => {
    // Round magnitudes
    feature.properties.mag = feature.properties.mag.toFixed(2)
  })

  return data
}
