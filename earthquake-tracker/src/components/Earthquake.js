import { getSetting } from "../assets/Culture";
const moment = require('moment-timezone');

export function getEarthquakePopup(data) {
    const mag = data.properties.mag;
    const tsunami = data.properties.tsunami === 1 ? "Yes"._(): "No"._();
    const title = data.properties.title.substring(data.properties.title.indexOf("-") + 2);
    const timeFormat = getSetting('timeFormat') === "24-Hour" ? "HH:mm" : "h:mm a";
    const TIMESTAMP = moment(data.properties.time).tz(getSetting('timeZone')).format(`${getSetting('dateFormat')} ${timeFormat}`) + " " + moment.tz(getSetting('timeZone')).zoneAbbr();
    return `<h5 class="text-center">${title}</h5>${TIMESTAMP}<br>${"Magnitude"._()}: ${mag}<br>${"Tsunami"._()}: ${tsunami}`;
}