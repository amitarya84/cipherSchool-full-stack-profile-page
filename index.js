const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();

app.use(express.json());

const userRout = require('./routs/users');

app.use('/users', userRout);

app.get('/', (req, res) => {
    const page = fs.readFileSync('./index.html');
    res.end(page)
})


//Connect to database
mongoose.connect('mongodb://localhost:27017/rest',{ useNewUrlParser: true }, () => {
    console.log('connected to DB')
})

app.listen(3000, ()=>{
    console.log('server is running on port', 3000)
});