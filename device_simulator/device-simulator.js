import mqtt from "mqtt";
import { classifyReading } from "./aqi.js";

const BACKEND_URL = "http://localhost:3000/api/measurements";
const DEVICE_ID = process.argv[2] || process.env.DEVICE_ID || "sensor-001";

const INTERVAL = 5000;

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = `devices/${DEVICE_ID}/telemetry`;

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

const client = mqtt.connect(BROKER_URL,{
    clientId:DEVICE_ID,
    username:"device",
    password:"supersecret",
});

client.on("connect", () => {
    console.log("Device connected to MQTT broker: ",BROKER_URL);

    setInterval(() => {
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
            co2: analysis.co2Info,
        });
        const payloadWithAQI = {
            ...payload,
            aqi: analysis.overallAQI,
            category: analysis.category?.category,
            health_message: analysis.category?.message,
            co2_level: analysis.co2Info?.level,
            co2_message: analysis.co2Info?.message,
        };

        const json = JSON.stringify(payloadWithAQI);

        client.publish(TOPIC, json, {qos: 1}, (error) => {
            if (error) {
                console.log("Publish error: ", error.message);
            } else {
                console.log(`Published to ${TOPIC}`);
            }
        });
    }, INTERVAL);
});

client.on("error", (error) => {
    console.error("MQTT error:", error);
});
