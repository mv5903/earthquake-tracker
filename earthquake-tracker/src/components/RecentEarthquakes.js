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

    let key = 0
    return (
        <div className={styles.display}>
            <h3 className={styles.title}>{"Recent Earthquakes"._()}</h3>
            {props.data['features'].map(dataPoint => {
                return (
                    <>
                        <RecentEarthquakeItem key={key++} changeLocation={props.changeLocation} data={dataPoint}/>
                    </>
                )
            })}
        </div>
    )
}


