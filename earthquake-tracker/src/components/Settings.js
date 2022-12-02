import styles from './RecentEarthquakes.module.css'
import { useState, useEffect } from 'react'
import { SETTINGS } from '../assets/settings'

export default function Settings() {
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [language, setLanguage] = useState(JSON.parse(localStorage.getItem('userData')).language)

    const settingsClicked = () => {
        setSettingsOpen(true)
    }

    useEffect(() => {
        var selects = Array.from(document.querySelectorAll('select'))
        // If settings is actually visible or not
        if (selects.length > 0) {
            // Have each select be listened to
            for (var i = 0; i < selects.length; i++) {
                // Set options to what they're set to already from local storage
                let options = selects[i].children
                for (var j = 0; j < options.length; j++) {
                    const currentOption = Object.values(JSON.parse(localStorage.getItem('userData')))[i]
                    if (options[j].innerHTML === currentOption) {
                        selects[i].selectedIndex = j
                    }
                }
            }
            // Add change event listener to modify local storage on dropdown option change
            selects.forEach(select => {
                select.addEventListener('change', e => {
                    if (selects.length > 0) {
                        let selectedOption = select.selectedOptions[0].text
                        overwriteLocalStorage(select.id, selectedOption)
                        if (select.id == 'language') {
                            setLanguage(selectedOption);
                        }
                    }
                })
            })
        }
    });

    if (settingsOpen) {
        // Translates the options of these settings to the user selected language
        const translateKeys = ["sortEarthquakesBy"];

        return (
            <div id={language + '-settings'}>
                <div className={styles.settingsMenu}>
                    <h3 className={styles.settingsTitle}>{"Settings"._()}</h3>
                    {
                        SETTINGS.map((setting, index) => {
                            return (
                                <div className={styles.select} key={index}>
                                    <p>{setting.name._()}:</p>
                                    <select id={setting.settingName}>
                                        {
                                            setting.options.map((option, settingIndex) => {
                                                return (
                                                    <option key={settingIndex}>{translateKeys.includes(setting.settingName) ? option._() : option}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                            );
                        })
                    }
                    <div className={styles.settingsButtonDiv}>
                        <button className={styles.closeButton} onClick={() => { setSettingsOpen(false); window.location.reload()}}>{"Save"._()}</button>
                    </div>
                </div>
                <img alt="Setting Icon" className={styles.icon} src={require('../assets/icons8-settings-240.png')} onClick={settingsClicked}></img>
            </div>
        )
    }
    return(
        <img alt="Setting Icon" className={styles.icon} src={require('../assets/icons8-settings-240.png')} onClick={settingsClicked}></img>
    )
}

function overwriteLocalStorage(option, value) {
    // Change a specific option inside local storage
    var userData = JSON.parse(localStorage.getItem('userData'))
    userData[option] = value
    localStorage.setItem('userData', JSON.stringify(userData))
}