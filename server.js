const express = require('express');
const mysql = require('mysql2');

const app = express();

 const PORT = precsss.env.PORT || 3001;

app.use(express.static());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('TEST');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})