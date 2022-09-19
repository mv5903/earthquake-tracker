import styles from './RecentEarthquakes.module.css'
import RecentEarthquakeItem from './RecentEarthquakeItem'
import { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function RecentEarthquakes({ changeLocation }) {

    const [showMore, setShowMore] = useState(false);

    const [data, setData] = useState(null);


    useEffect(() => fetchData(), []);
    
    async function fetchData() {
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await response.json();
        setData(data);
    }

    if (!data) {
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
            {data['features'].map((dataPoint, index) => {
                if (!showMore)
                    return (
                        <>
                            <RecentEarthquakeItem key={index} changeLocation={changeLocation} data={dataPoint}/>
                        </>
                    )
            })}
        </div>
    )
}


