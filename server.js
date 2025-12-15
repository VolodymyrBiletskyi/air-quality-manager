import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './Controllers/UserController.js';
import deviceRouter from './Controllers/DeviceController.js';
import measurementRouter from "./Controllers/MeasurementController.js";
import alertRouter from './Controllers/AlertController.js';
import alertRuleRouter from './Controllers/AlertRuleController.js';
import { startMqttListener } from './Extensions/mqtt-listener.js';
import authRoutes from './Controllers/AuthController.js';


const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/devices', deviceRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/alert-rules', alertRuleRouter);
app.use('/api/users', userRouter);
app.use("/api/measurements", measurementRouter);
app.use('/api/auth', authRoutes);


let memoryStorage = [];

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.get("/api/readings", (req, res) => {
   res.json(memoryStorage);
});
startMqttListener();

app.listen(port, () => console.log("Backend running on http://localhost:" + port));