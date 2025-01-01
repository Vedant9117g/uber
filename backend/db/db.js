const mongoose = require('mongoose');

function connectToDB() {
    console.log('DB_CONNECT:', process.env.DB_CONNECT);
    mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.error('Error connecting to database:', err);
        });
}

module.exports = connectToDB;
