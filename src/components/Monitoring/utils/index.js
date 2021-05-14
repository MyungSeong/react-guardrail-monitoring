export { default as ApiManager } from './ApiManager';

/*  timestamp 날짜형식 변환  */
const timestampDefaultFormat = {
    Y: ".",
    M: ".",
    D: "",
    h: ":",
    m: ":",
    s: ""
};

/** Timstamp to custom format */
export const dateFormatConverter = (
    ts,
    customFormat = null,
    filters = null
) => {
    let format = { ...timestampDefaultFormat };
    if (customFormat) format = { ...format, ...customFormat };
    const date = new Date(ts);
    let result = {
        Y: date.getFullYear(),
        M:
            date.getMonth() + 1 < 10
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1,
        D: date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1,
        h:
            date.getHours() + 1 < 10
                ? `0${date.getHours() + 1}`
                : date.getHours() + 1,
        m:
            date.getMinutes() + 1 < 10
                ? `0${date.getMinutes() + 1}`
                : date.getMinutes() + 1,
        s:
            date.getSeconds() + 1 < 10
                ? `0${date.getSeconds() + 1}`
                : date.getSeconds() + 1
    };

    if (filters) {
        let rr = "";
        for (let i of filters) {
            rr += `${result[i]}${format[i]} `;
        }
        return rr;
    }
    return `${result.Y}${format.Y}${result.M}${format.M}${result.D}${format.D} ${result.h}${format.h}${result.m}${format.m}${result.s}${format.s}`;
};

/**
 * 금액 포맷터
 */
export const stringToMoneyFormat = (v, unit = "") => {
    const value = String(v)
        .split("")
        .reverse()
        .join("");
    const valueLength = value.length;
    let result = "";
    for (let ii in value) {
        result += String(value[ii]);
        if ((ii + 1) % 3 === 0 && ii < valueLength - 1) {
            result += ",";
        }
    }
    return `${result
        .split("")
        .reverse()
        .join("")}${unit}`;
};

/**
 *
 */
export const momentDateToString = value => {
    const year = value.year();
    const month =
        value.month() + 1 < 10 ? `0${value.month() + 1}` : value.month() + 1;
    const day = value.date() < 10 ? `0${value.date()}` : value.date();

    return `${year}-${month}-${day}`;
};



/**
 * setSession
 * @param {*} url
 * @오경우 2019-10-14 14:59:06
 */
export const setSession = (key, value) => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    if (getSession(key) !== null) {
        return true;
    } else {
        return false;
    }
};

/**
 * getSession
 * @param {*} url
 * @오경우 2019-10-14 14:59:08
 */
export const getSession = key => {
    const session = window.sessionStorage.getItem(key);
    return JSON.parse(session);
};

export const clearSession = () => {
    window.sessionStorage.clear();
};
