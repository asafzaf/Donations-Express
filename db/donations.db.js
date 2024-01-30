const mongoose = require('mongoose');
const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const connnectDB = () => {
    mongoose.connect(connectionUrl)
.then(() => {
    console.log('Connected to MongoDB');   
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
};
module.exports = {connnectDB };