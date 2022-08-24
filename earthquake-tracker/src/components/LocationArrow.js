import { useEffect } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import styles from './LocationArrow.module.css';

export default function LocationArrow(props) {
    // Default values
    let lat = -137;
    let lng = 31;
    useEffect(() => {
        // 1 : Attempt Geolocation Detection
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
            });
        } else {
            try {
                fetch('https://api.ipify.org/?format=json')
                .then(ipResponse => ipResponse.json())
                .then(ipData => {
                    fetch(`https://ipapi.co/${ipData.ip}/json/`)
                        .then(locateResponse => locateResponse.json())
                        .then(locateData => {
                            lat = locateData.lat;
                            lng = locateData.lon;
                        });
                });
            }
            catch(e) {
                console.log(e);
            }
        }
    } , []);
    return (
        <div>
            <FaLocationArrow className={styles.locationArrow} onClick={() => props.changeLocation(lng, lat)}/>
        </div>
    )
}