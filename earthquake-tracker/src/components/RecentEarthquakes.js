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
        // Check for any filters
        const USER = JSON.parse(localStorage.getItem('userData'))

        const data = await response.json();
        switch (USER.sortEarthquakesBy) {
            case 'Most Recent comes first':
                data.features.sort((a, b) => b.properties.time - a.properties.time);
                break;
            case 'Most Recent comes last':
                data.features.sort((a, b) => a.properties.time - b.properties.time);
                break;
            case 'Magnitude (Highest to Lowest)':
                data.features.sort((a, b) => b.properties.mag - a.properties.mag);
                break;
            case 'Magnitude (Lowest to Highest)':
                data.features.sort((a, b) => a.properties.mag - b.properties.mag);
                break;
            case "Location (A-Z)":
                data.features.sort((a, b) => a.properties.place.substring(a.properties.place.indexOf("of") + 3) < (b.properties.place.substring(b.properties.place.indexOf("of") + 3) ? -1 : 1));

                break;
            case "Location (Z-A)":
                data.features.sort((a, b) => b.properties.place.substring(b.properties.place.indexOf("of") + 3) < (a.properties.place.substring(a.properties.place.indexOf("of") + 3) ? -1 : 1));
                break;
        }
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
                        <div  key={index}>
                            <RecentEarthquakeItem changeLocation={changeLocation} data={dataPoint}/>
                        </div>
                    )
                else
                    return null;
            })}
        </div>
    )
}


