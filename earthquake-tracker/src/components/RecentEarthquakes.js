import styles from './RecentEarthquakes.module.css'
import { useEffect, useState } from 'react'
import RecentEarthquakeItem from './RecentEarthquakeItem'
import { MAP } from '../App'
import mapboxgl from 'mapbox-gl'

export default function RecentEarthquakes(props) {
    const siteData = props.data

    if (siteData.length == 0) {
        return (
            <div className={styles.display}>
                (No data yet, please wait..)
            </div>
        )
    }

    return (
        <div className={styles.display}>
            <h3 className={styles.title}>Recent Earthquakes</h3>
            {siteData['features'].map(dataPoint => {
                return (
                    <>
                        <RecentEarthquakeItem data={dataPoint}/>
                    </>
                )
            })}
        </div>
    )
}


