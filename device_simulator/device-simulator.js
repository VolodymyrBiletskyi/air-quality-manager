// import axios from "axios"

const BACKEND_URL = null;//process.env.BACKEND_URL || 'http://localhost:3000/api/telemetry';
const DEVICE_ID = "test-sim-001";/*process.env.DEVICE_ID || "js-sim-01";*/
const INTERVAL = 5000;//parseInt(process.env.INTERVAL || "5000");

function generateReading(){
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
    console.log("Device Simulator started; Sending telemetry to:", BACKEND_URL)

    while(true){
        const payload = generateReading();
        console.log("generated", payload);
        // try{
        //     const res = await axios.post(BACKEND_URL, payload);
        //     console.log("Sent: ", payload, "->", res.status);
        // }
        // catch(err){
        //     console.error("Send failed", err.message);
        // }
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
    }
}

main();