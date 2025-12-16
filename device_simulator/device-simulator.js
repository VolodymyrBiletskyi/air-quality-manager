import { config } from 'dotenv';
config();
import mqtt from "mqtt";
import { classifyReading } from "./aqi.js";

const BROKER_URL = "mqtt://172.161.145.151:1883";

const DEVICE_ID = process.argv[2] || process.env.DEVICE_ID || "";
if (!DEVICE_ID) {
    console.error("DEVICE_ID is required. Usage: node device-simulator.js <deviceId>");
    process.exit(1);
}

const INTERVAL = Number(process.env.INTERVAL_MS || 5000);



const TELEMETRY_TOPIC = `devices/${DEVICE_ID}/telemetry`;

function generateReading() {
    return {
        device_id: DEVICE_ID,
        timestamp: new Date().toISOString(),
        pm25: Number((Math.random() * 80).toFixed(2)),
        pm10: Number((Math.random() * 120).toFixed(2)),
        co2: Number((400 + Math.random() * 1000).toFixed(1)),
        temp: Number((15 + Math.random() * 15).toFixed(2)),
        humidity: Number((20 + Math.random() * 60).toFixed(2)),
    };
}

console.log("BROKER_URL =", BROKER_URL);
console.log("DEVICE_ID   =", DEVICE_ID);
console.log("TOPIC       =", TELEMETRY_TOPIC);

const client = mqtt.connect(BROKER_URL, {
    clientId: DEVICE_ID,
    username: process.env.MQTT_USER || "device",
    password: process.env.MQTT_PASS || "supersecret",
});

client.on("connect", () => {
    console.log("Device connected to MQTT broker:", BROKER_URL);

    setInterval(() => {
        const payload = generateReading();
        const analysis = classifyReading({
            pm25: payload.pm25,
            pm10: payload.pm10,
            co2: payload.co2,
        });

        const payloadWithAQI = {
            ...payload,
            aqi: analysis.overallAQI,
            category: analysis.category?.category,
            health_message: analysis.category?.message,
            co2_level: analysis.co2Info?.level,
            co2_message: analysis.co2Info?.message,
        };

        client.publish(TELEMETRY_TOPIC, JSON.stringify(payloadWithAQI), { qos: 1 }, (err) => {
            if (err) console.log("Publish error:", err.message);
            else console.log(`Published to ${TELEMETRY_TOPIC}`);
        });
    }, INTERVAL);
});

client.on("error", (error) => {
    console.error("MQTT error:", error);
});
