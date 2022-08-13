import styles from './RecentEarthquakes.module.css'
import RecentEarthquakeItem from './RecentEarthquakeItem'

export default function RecentEarthquakes(props) {

    if (props.data.length === 0) {
        return (
            <div className={styles.display}>
                {"No data yet, please wait.."._()}
            </div>
        )
    }
    return (
        <div className={styles.display}>
            <h3 className={styles.title}>{"Recent Earthquakes"._()}</h3>
            {props.data['features'].map((dataPoint, index) => {
                return (
                    <>
                        <RecentEarthquakeItem key={index} changeLocation={props.changeLocation} data={dataPoint}/>
                    </>
                )
            })}
        </div>
    )
}


