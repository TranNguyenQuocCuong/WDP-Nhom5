const mongoose = require('mongoose');
require('dotenv').config();


/* mongoose.connect(`mongodb://${process.env.HOST}:27017/${process.env.MONGODB}`)
 *     .then(() => console.log('Connected!'));
 */

const connectToDatabase = async () => {
    // try {
    //     const connection = await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.MONGODB}`);
    //     console.log(`>>> Connected to MongoDB: mongodb://${process.env.DB_HOST}/${process.env.MONGODB}`);
    //     return connection;
    // } catch (error) {
    //     console.error('Error connecting to MongoDB:', error);
    //     throw error;
    // }

    // mongoose.connect('mongodb://127.0.0.1:27017/gym', { useNewUrlParser: true, useUnifiedTopology: true });

    // const db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error:'));
    // db.once('open', () => {
    //     console.log('Connected to MongoDB');
    // });
};


module.exports = connectToDatabase;
