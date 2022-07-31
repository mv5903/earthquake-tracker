import styles from './RecentEarthquakes.module.css'
const moment = require('moment-timezone')

export default function RecentEarthquakeItem(props) {
    const data = props.data;

    // Define default options and listen for them constantly, if they don't already exist
    const USER = JSON.parse(localStorage.getItem('userData'))
    const timeFormat = USER.timeFormat === '24-Hour' ? 'HH:mm' : 'h:mm a';
    const timestamp = moment(data.properties.time).tz(USER.timeZone).format(`${USER.dateFormat} ${timeFormat}`) + ' ' + moment.tz(USER.timeZone).zoneAbbr();
    
    const itemClicked = () => {
        props.changeLocation(data.geometry.coordinates[1], data.geometry.coordinates[0])
    }

    // Changing title to reflect user selected unit
    if (USER.units !== 'Metric') {
        if (data.properties.title.includes('km')) {
            data.properties.title = data.properties.title.replaceAll('km', 'mi');
        }
    }

    // Changing "of" and localizing based on user selected language
    if (data.properties.title.includes('of')) {
        data.properties.title = data.properties.title.replaceAll("of", "of"._());
    }

    return (
        <div className={styles.item} onClick={itemClicked}>
            <h4>{data.properties.title}</h4>
            <p className={styles.date}>{timestamp}</p>
        </div>
    )
}