import styles from './RecentEarthquakes.module.css'
import { useState } from 'react'

export default function Settings() {
    const [settingsOpen, setSettingsOpen] = useState(false)

    function settingsClicked() {
        console.log('Clicked')
        setSettingsOpen(true)
    }
    if (settingsOpen) {
        return(
            <>
                <div className={styles.settingsMenu}>
                    Settings
                    <button onClick={() => setSettingsOpen(false)}></button>
                </div>
                <img className={styles.icon} src={require('../assets/icons8-settings-240.png')} onClick={settingsClicked}></img>
            </>
        )
    }
    return(
        <img className={styles.icon} src={require('../assets/icons8-settings-240.png')} onClick={settingsClicked}></img>
    )
}