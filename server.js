require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 8080;
const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

mongoose.connect(connectionUrl)
.then(() => {
    console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
    
const { donationsRouter } = require('./routers/donations.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/donations', donationsRouter);

app.all('*', (req, res, next) => {
    res.status(404).send('Not Found');
});