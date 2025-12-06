import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000 //process.env.PORT || 8814;
app.use(cors());
app.use(express.json());

let memoryStorage = [];

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.post("/api/readings", (req, res) => {
    const reading = req.body;
    if(!reading.device_id){
        return res.status(400).json({error: "device_id is required"});
    }

    memoryStorage.push(reading);
    console.log("Received reading:", reading);
    res.status(201).json({message: "Reading stored"});
});

app.get("/api/readings", (req, res) => {
   res.json(memoryStorage);
});

app.listen(port, () => console.log("Backend running on http://localhost:" + port));