import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import { AlertService } from './Services/AlertService.js';

const prisma = new PrismaClient();
const alertService = new AlertService();

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC = "devices/+/telemetry";

export function startMqttListener() {
    const client = mqtt.connect(BROKER_URL, {
        clientId: 'backend-listener',
        username: 'device',
        password: 'supersecret'
    });

    client.on('connect', () => {
        console.log('✅ Backend connected to MQTT broker');
        client.subscribe(TOPIC, { qos: 1 }, (err) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                console.log(`📡 Subscribed to ${TOPIC}`);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('📨 Received telemetry:', data);

            await prisma.measurement.create({
                data: {
                    deviceId: data.device_id,
                    timestamp: new Date(data.timestamp),
                    pm2_5: data.pm25,
                    pm10: data.pm10,
                    co2: data.co2,
                    temperature: data.temp,
                    humidity: data.humidity,
                    aqi: data.aqi,
                    category: data.category,
                    healthMessage: data.health_message
                }
            });

            // Check alert rules
            await checkAlertRules(data);

        } catch (error) {
            console.error('❌ Error processing message:', error);
        }
    });

    client.on('error', (error) => {
        console.error('❌ MQTT error:', error);
    });
}

async function checkAlertRules(data) {
    const alertRules = await prisma.alertRule.findMany({
        where: {
            deviceId: data.device_id,
            isActive: true
        }
    });

    for (const rule of alertRules) {
        let triggered = false;
        let message = '';

        if (rule.pm2_5Threshold && data.pm25 > rule.pm2_5Threshold) {
            triggered = true;
            message = `PM2.5 exceeded: ${data.pm25} µg/m³ (threshold: ${rule.pm2_5Threshold})`;
        }

        if (rule.pm10Threshold && data.pm10 > rule.pm10Threshold) {
            triggered = true;
            message = `PM10 exceeded: ${data.pm10} µg/m³ (threshold: ${rule.pm10Threshold})`;
        }

        if (rule.co2Threshold && data.co2 > rule.co2Threshold) {
            triggered = true;
            message = `CO2 exceeded: ${data.co2} ppm (threshold: ${rule.co2Threshold})`;
        }

        if (rule.aqiThreshold && data.aqi > rule.aqiThreshold) {
            triggered = true;
            message = `AQI exceeded: ${data.aqi} (threshold: ${rule.aqiThreshold})`;
        }

        if (triggered) {
            await alertService.createAlert({
                alertRuleId: rule.id,
                deviceId: data.device_id,
                message: message
            });
            console.log(`🚨 Alert created: ${message}`);
        }
    }
}
