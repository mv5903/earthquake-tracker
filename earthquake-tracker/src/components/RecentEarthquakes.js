import styles from './RecentEarthquakes.module.css'
import RecentEarthquakeItem from './RecentEarthquakeItem'
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function RecentEarthquakes(props) {

    const [showMore, setShowMore] = useState(false);

    if (props.data.length === 0) {
        return (
            <div className={styles.display}>
                {"No data yet, please wait.."._()}
            </div>
        )
    }
    return (
        <div className={`${styles.display} ${!showMore ? styles.displayExpanded : styles.displayCollapsed}`}>
            <div className="d-flex justify-content-center">
                <h4 className="text-center mt-2 me-4">{"Recent Earthquakes"._()}</h4>
                <IoIosArrowDown id="arrow" className={`${styles.arrow} ${showMore ? styles.expandedarrow : ''}`} onClick={() => setShowMore(!showMore)}/>
            </div>
            {props.data['features'].map((dataPoint, index) => {
                if (!showMore)
                    return (
                        <>
                            <RecentEarthquakeItem key={index} changeLocation={props.changeLocation} data={dataPoint}/>
                        </>
                    )
            })}
        </div>
    )
}


