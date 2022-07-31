import styles from './RecentEarthquakes.module.css'
import { useState } from 'react'
const moment = require('moment')


export default function RecentEarthquakeItem(props) {
    const data = props.data;

    // Define default options and listen for them constantly, if they don't already exist
    const USER = JSON.parse(localStorage.getItem('userData'))
    const timeFormat = USER.timeFormat === '24-Hour' ? 'HH:mm' : 'h:mm a';
    const timestamp = moment(data.properties.time).tz(USER.timeZone).format('MM/DD/yyyy ' + timeFormat) + ' ' + moment.tz(USER.timeZone).zoneAbbr();
    
    const itemClicked = (name) => {
        props.changeLocation(data.geometry.coordinates[1], data.geometry.coordinates[0])
    }

    var titleDistance = ''
    if (USER.units === 'Metric') {
        titleDistance = data.properties.title
    } else {
        if (data.properties.title.includes('km')) {
            var oldTitle = data.properties.title
            var km = ''
            var oldIndex = 0
            for (var i = 8; i < oldTitle.length; i++) {
                if (oldTitle.charAt(i) === 'k' || oldTitle.charAt(i) == ' ') {
                    oldIndex = i + 3
                    break
                } else {
                    km += oldTitle.charAt(i)
                }
            }
            var mi = (km / 1.609).toFixed(1)
            var newTitle = oldTitle.substring(0, 8)
            newTitle += mi + 'mi '
            for (var i = oldIndex; i < oldTitle.length; i++) {
                newTitle += oldTitle.charAt(i)
            }
            //Remove any double white space
            newTitle = newTitle.replace(/\s{2,}/g, ' ')
            data.properties.title = newTitle
        }
    }

    return (
        <div className={styles.item} onClick={itemClicked}>
            <h4>{data.properties.title}</h4>
            <p className={styles.date}>{timestamp}</p>
        </div>
    )
}