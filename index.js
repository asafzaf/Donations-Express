require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const { donationsRouter } = require('./routers/donations.router');
const { connnectDB } = require('./db/donations.db');

const app = express();
const port = process.env.PORT || 8080;

module.exports = app;

connnectDB();   

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/donations', donationsRouter);

app.all('*', (req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});