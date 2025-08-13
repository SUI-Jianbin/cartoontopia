/**
 *
 * Server.js for starting a server
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('MONGODB_URI =', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB is Connected！'))
    .catch(err => console.log('MongoDB connection error: ',err));

// Routes
app.use('/characters', require('./routes/character-routes'));
app.use('/contribution', require('./routes/contribution-routes'));
app.use('/userlist', require('./routes/user-routes'));
app.use('/characters', require('./routes/character-routes'));
app.use('/favourites', require('./routes/favourite-routes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));