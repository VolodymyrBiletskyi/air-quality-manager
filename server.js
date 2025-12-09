import express from 'express';
import cors from 'cors';
import { addMeasurement } from "./Extensions/measurements.js";

const app = express();
const port = 3000 //process.env.PORT || 8814;
app.use(cors());
app.use(express.json());

let memoryStorage = [];

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.post("/api/measurements", addMeasurement);


app.get("/api/readings", (req, res) => {
   res.json(memoryStorage);
});

app.listen(port, () => console.log("Backend running on http://localhost:" + port));