import styles from './RecentEarthquakes.module.css'
import { useEffect } from 'react'
import { MAP } from '../App'

export default function RecentEarthquakeItem(props) {
    const data = props.data

    const timestamp = new Date(data.properties.time)

    return (
        <div className={styles.item}>
            <h4>{data.properties.title}</h4>
            <p>{timestamp.toUTCString()}</p>
        </div>
    )
}