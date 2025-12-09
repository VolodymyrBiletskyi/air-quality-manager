
const PM25_BREAKPOINTS = [
    { cLo: 0.0, cHi: 12.0, iLo: 0, iHi: 50 },
    { cLo: 12.1, cHi: 35.4, iLo: 51, iHi: 100 },
    { cLo: 35.5, cHi: 55.4, iLo: 101, iHi: 150 },
    { cLo: 55.5, cHi: 150.4, iLo: 151, iHi: 200 },
    { cLo: 150.5, cHi: 250.4, iLo: 201, iHi: 300 },
    { cLo: 250.5, cHi: 350.4, iLo: 301, iHi: 400 },
    { cLo: 350.5, cHi: 500.4, iLo: 401, iHi: 500 }
];

const PM10_BREAKPOINTS = [
    { cLo: 0, cHi: 54, iLo: 0, iHi: 50 },
    { cLo: 55, cHi: 154, iLo: 51, iHi: 100 },
    { cLo: 155, cHi: 254, iLo: 101, iHi: 150 },
    { cLo: 255, cHi: 354, iLo: 151, iHi: 200 },
    { cLo: 355, cHi: 424, iLo: 201, iHi: 300 },
    { cLo: 425, cHi: 504, iLo: 301, iHi: 400 },
    { cLo: 505, cHi: 604, iLo: 401, iHi: 500 }
];

function truncate(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
}

function calcAQIFromBreakpoints(conc, breakpoints, truncateDecimals) {
    const c = truncate(conc, truncateDecimals);
    for (const bp of breakpoints) {
        if (c >= bp.cLo && c <= bp.cHi) {
            const { cLo, cHi, iLo, iHi } = bp;
            const aqi = ((iHi - iLo) / (cHi - cLo)) * (c - cLo) + iLo;
            return Math.round(aqi);
        }
    }
    return 500;
}

export function calculateAQIForPM25(concentration) {
    return calcAQIFromBreakpoints(concentration, PM25_BREAKPOINTS, 1);
}

export function calculateAQIForPM10(concentration) {
    // EPA uses integer for PM10
    return calcAQIFromBreakpoints(concentration, PM10_BREAKPOINTS, 0);
}

export function categorizeAQI(aqi) {
    if (aqi <= 50) return { category: "Good", color: "green", message: "Air quality is satisfactory." };
    if (aqi <= 100) return { category: "Moderate", color: "yellow", message: "Acceptable for most; sensitive groups should take care." };
    if (aqi <= 150) return { category: "Unhealthy for Sensitive Groups", color: "orange", message: "Children, elderly, and people with respiratory disease should reduce prolonged exertion." };
    if (aqi <= 200) return { category: "Unhealthy", color: "red", message: "General public may experience health effects; sensitive groups more so." };
    if (aqi <= 300) return { category: "Very Unhealthy", color: "purple", message: "Health warnings of emergency conditions. Everyone should avoid outdoor exertion." };
    return { category: "Hazardous", color: "maroon", message: "Health alert: everyone may experience serious health effects." };
}

export function co2Guideline(ppm) {
    if (ppm <= 1000) return { level: "Good", message: "Ventilation adequate." };
    if (ppm <= 2000) return { level: "Moderate", message: "Consider increasing ventilation; drowsiness or poor concentration possible." };
    if (ppm <= 5000) return { level: "Poor", message: "Strong ventilation recommended; health effects possible." };
    return { level: "Hazardous", message: "Avoid exposure; ventilate immediately." };
}

export function classifyReading({ pm25, pm10, co2 } = {}) {
    const pm25AQI = typeof pm25 === "number" ? calculateAQIForPM25(pm25) : null;
    const pm10AQI = typeof pm10 === "number" ? calculateAQIForPM10(pm10) : null;

    const pollutantAQIs = [];
    if (pm25AQI !== null) pollutantAQIs.push({ pollutant: "pm25", aqi: pm25AQI });
    if (pm10AQI !== null) pollutantAQIs.push({ pollutant: "pm10", aqi: pm10AQI });

    const overall = pollutantAQIs.length ? pollutantAQIs.reduce((max, cur) => (cur.aqi > max.aqi ? cur : max)) : null;
    const overallAQI = overall ? overall.aqi : null;
    const category = overallAQI !== null ? categorizeAQI(overallAQI) : null;
    const co2Info = typeof co2 === "number" ? co2Guideline(co2) : null;

    return {
        pollutantAQIs,
        overallAQI,
        dominantPollutant: overall ? overall.pollutant : null,
        category,
        co2Info
    };
}
