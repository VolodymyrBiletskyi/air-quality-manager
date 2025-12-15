import mqtt from "mqtt";
import { classifyReading } from "./aqi.js";

const DEVICE_ID =
    process.argv[2] || process.env.DEVICE_ID || "78068553-1e99-4824-aea2-0f6f90e2c0d0";

const INTERVAL = Number(process.env.INTERVAL_MS || 5000);

const BROKER_URL = process.env.BROKER_URL || "mqtt://localhost:1883";

const TELEMETRY_TOPIC = `devices/${DEVICE_ID}/telemetry`;
const COMMAND_TOPIC = `devices/${DEVICE_ID}/commands`;

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

const client = mqtt.connect(BROKER_URL, {
    clientId: DEVICE_ID,
    username: process.env.MQTT_USER || "device",
    password: process.env.MQTT_PASS || "supersecret",
});

let timer = null;

function startPublishing() {
    if (timer) return;
    timer = setInterval(() => {
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

        const json = JSON.stringify(payloadWithAQI);

        client.publish(TELEMETRY_TOPIC, json, { qos: 1 }, (error) => {
            if (error) console.log("Publish error:", error.message);
            else console.log(`Published to ${TELEMETRY_TOPIC}`);
        });
    }, INTERVAL);

    console.log("Device publishing ENABLED");
}

function stopPublishing() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    console.log("Device publishing DISABLED");
}

client.on("connect", () => {
    console.log("Device connected to MQTT broker:", BROKER_URL);

    client.subscribe(COMMAND_TOPIC, { qos: 1 }, (err) => {
        if (err) console.error("Subscribe error:", err);
        else console.log("Subscribed to:", COMMAND_TOPIC);
    });

    if (process.env.START_ENABLED === "true") startPublishing();
});

client.on("message", (topic, message) => {
    if (topic !== COMMAND_TOPIC) return;

    let cmd;
    try {
        cmd = JSON.parse(message.toString());
    } catch {
        console.warn("Invalid command JSON:", message.toString());
        return;
    }

    const action = String(cmd.action || "").toUpperCase();

    if (action === "ON") startPublishing();
    else if (action === "OFF") stopPublishing();
    else console.warn("Unknown command:", cmd);
});

client.on("error", (error) => {
    console.error("MQTT error:", error);
});
