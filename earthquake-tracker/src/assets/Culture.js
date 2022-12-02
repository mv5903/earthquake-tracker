import { LANGUAGE } from "./localization";
import { SETTINGS } from "./settings";

export function getSetting(key) {
    const settings = JSON.parse(localStorage.getItem("userData"));
    if (settings) {
        return settings[key];
    }
}

export function setSetting(key, value) {
    const settings = JSON.parse(localStorage.getItem("userData"));
    if (settings) {
        settings[key] = value;
        localStorage.setItem("userData", JSON.stringify(settings));
    }
}

export function getLocale() {
    return LANGUAGE[getSetting("language")]['locale'];
}

export function initApp() {
    // Setup local storage
    if (!localStorage.getItem("userData")) {
        let userData = {};
        SETTINGS.forEach(
            (setting) => (userData[setting.settingName] = setting.value)
        );
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    // Setup localization
    Object.defineProperty(String.prototype, "_", {
        value: function _() {
            const USER = JSON.parse(localStorage.getItem("userData"));
            if (!LANGUAGE[USER.language][this]) {
                console.error('Missing translation for "' + this + '"');
                return this;
            }
            return LANGUAGE[USER.language][this];
        },
        writable: true,
        configurable: true,
    });
}