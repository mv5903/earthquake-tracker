import styles from './RecentEarthquakes.module.css'
const moment = require('moment-timezone')

export default function RecentEarthquakeItem(props) {
    const data = props.data;

    // Define default options and listen for them constantly, if they don't already exist
    const USER = JSON.parse(localStorage.getItem('userData'))
    const timeFormat = USER.timeFormat === '24-Hour' ? 'HH:mm' : 'h:mm a';
    const timestamp = moment(data.properties.time).tz(USER.timeZone).format(`${USER.dateFormat} ${timeFormat}`) + ' ' + moment.tz(USER.timeZone).zoneAbbr();
    
    const itemClicked = () => {
        props.changeLocation(data.geometry.coordinates[1], data.geometry.coordinates[0], data)
    }

    // Changing title to reflect user selected unit
    if (USER.units !== 'Metric') {
        if (data.properties.title.includes('km')) {
            data.properties.title = data.properties.title.replaceAll('km', 'mi');
            data.properties.title = data.properties.title.replaceAll('M ', '')
        }
    }

    // Changing "of" and localizing based on user selected language
    if (data.properties.title.includes('of')) {
        data.properties.title = data.properties.title.replaceAll("of", "of"._());
    }

    // Getting rid of gap that sometimes appears next to mi and km
    if (!data.properties.title.includes(' mi')) {
        data.properties.title = data.properties.title.replaceAll('mi', ' mi');
    }
    if (!data.properties.title.includes(' km')) {
        data.properties.title = data.properties.title.replaceAll('km', ' km');
    }

    return (
        <div className={styles.item} onClick={itemClicked}>
            <h5>{data.properties.title}</h5>
            <p className="text-muted">{timestamp}</p>
        </div>
    )
}