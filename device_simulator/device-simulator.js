import axios from "axios";
import { classifyReading } from "./aqi.js";

const BACKEND_URL = "http://localhost:3000/api/measurements";
const DEVICE_ID = process.argv[2] || process.env.DEVICE_ID || "sensor-001";
const INTERVAL = 5000;

function generateReading() {
    return {
        device_id: DEVICE_ID,
        timestamp: new Date().toISOString(),
        pm25: Number((Math.random() * 80).toFixed(2)),
        pm10: Number((Math.random() * 120).toFixed(2)),
        co2: Number((400 + Math.random() * 1000).toFixed(1)),
        temp: Number((15 + Math.random() * 15).toFixed(2)),
        humidity: Number((20 + Math.random() * 60).toFixed(2))

    };

}

async function main() {
    console.log("Device Simulator started; Sending telemetry to:", BACKEND_URL);

    while (true) {
        const payload = generateReading();

        const analysis = classifyReading({
            pm25: payload.pm25,
            pm10: payload.pm10,
            co2: payload.co2
        });

        console.log("Generated:", payload);
        console.log("AQI Analysis:", {
            overallAQI: analysis.overallAQI,
            category: analysis.category?.category,
            healthConcern: analysis.category?.message,
            dominantPollutant: analysis.dominantPollutant,
            co2: analysis.co2Info
        });
        const payloadWithAQI = {
            ...payload,
            aqi: analysis.overallAQI,
            category: analysis.category?.category,
            health_message: analysis.category?.message
        };



        try {
            const res = await axios.post(BACKEND_URL, payloadWithAQI);
            console.log("Sent ->", res.status);
        } catch (err) {
            console.error("Send failed", err.message);
        }

        await new Promise(resolve => setTimeout(resolve, INTERVAL));
    }
}

main();
