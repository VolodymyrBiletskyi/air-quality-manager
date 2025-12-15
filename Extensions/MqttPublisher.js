import mqtt from "mqtt";

export class MqttPublisher {
    constructor() {
        this.url = process.env.MQTT_URL;
        this.username = process.env.MQTT_USER || "api";
        this.password = process.env.MQTT_PASS || "apisecret";

        if (!this.url) throw new Error("MQTT_URL is not set");

        this.client = mqtt.connect(this.url, {
            clientId: "api-publisher",
            username: this.username,
            password: this.password,
            reconnectPeriod: 1000,
        });

        this.client.on("connect", () => console.log("MQTT publisher connected"));
        this.client.on("error", (e) => console.error("MQTT publisher error:", e));
    }

    publish(topic, payload, options = { qos: 1,retain:false }) {
        return new Promise((resolve, reject) => {
            const msg = JSON.stringify(payload);

            this.client.publish(topic, msg, options, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}
