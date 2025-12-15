import mqtt from "mqtt";

export class MqttPublisher {
    constructor() {
        this.url = process.env.MQTT_URL || "mqtt://localhost:1883";
        this.username = process.env.MQTT_USER || "api";
        this.password = process.env.MQTT_PASS || "apisecret";
    }

    publish(topic, payload, options = { qos: 1 }) {
        return new Promise((resolve, reject) => {
            const client = mqtt.connect(this.url, {
                username: this.username,
                password: this.password,
            });

            client.on("connect", () => {
                client.publish(topic, JSON.stringify(payload), options, (err) => {
                    client.end();
                    if (err) reject(err);
                    else resolve();
                });
            });

            client.on("error", (e) => {
                client.end();
                reject(e);
            });
        });
    }
}
