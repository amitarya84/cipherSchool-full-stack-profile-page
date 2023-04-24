const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors())

const userRout = require('./routs/users');

app.use(express.static('/profile_page_cipher/dist'))

app.use('/users', userRout);

app.get('/', (req, res) => {
    const page = fs.readFileSync('./index.html');
    res.end(page)
})


//Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'cipherSchools',
})

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server is running on port', PORT)
});