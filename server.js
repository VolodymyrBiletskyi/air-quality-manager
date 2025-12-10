import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './Controllers/UserController.js';
import { addMeasurement } from "./Extensions/measurements.js";
import deviceRouter from './Controllers/DeviceController.js';
import alertRouter from './Controllers/AlertController.js';
import alertRuleRouter from './Controllers/AlertRuleController.js';
import { startMqttListener } from './mqtt-listener.js';


const app = express();
const port = 3000 //process.env.PORT || 8814;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/devices', deviceRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/alert-rules', alertRuleRouter);
app.use('/api', userRouter);

let memoryStorage = [];

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.post("/api/measurements", addMeasurement);


app.get("/api/readings", (req, res) => {
   res.json(memoryStorage);
});
startMqttListener();

app.listen(port, () => console.log("Backend running on http://localhost:" + port));