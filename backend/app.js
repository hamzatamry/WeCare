const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const coachRoutes = require('./routes/coach');

const app = express();

const dbOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
mongoose.connect('mongodb+srv://' + process.env.MONGO_ATLAS_USER + ':' + process.env.MONGO_ATLAS_PW + '@cluster0-scadc.mongodb.net/database?retryWrites=true&w=majority', dbOptions)
.then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.error("Connection to database has failed...");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/coach', coachRoutes);

module.exports = app;