import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './Controllers/UserController.js';
import deviceRouter from './Controllers/DeviceController.js';
import measurementRouter from "./Controllers/MeasurementController.js";


const app = express();
const port = 3000 //process.env.PORT || 8814;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/devices', deviceRouter);
app.use('/api/users', userRouter);
app.use("/api/measurements", measurementRouter);

let memoryStorage = [];

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.get("/api/readings", (req, res) => {
   res.json(memoryStorage);
});

app.listen(port, () => console.log("Backend running on http://localhost:" + port));