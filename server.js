import express from 'express';

const app = express();
const port = process.env.PORT || 8814;

app.get('/', (req, res) => {
    res.send("<h1>Sosal?</h1>");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})