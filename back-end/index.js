const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/* --- Middleware --- */
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Allow the server to accept and parse JSON in request bodies
app.use(express.json());

/* --- MongoDB Connection using Mongoose --- */
mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Successfully connected to MongoDB!"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

/* --- API Routes --- */
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));

// A simple root route to test if the server is up
app.get('/', (req, res) => {
    res.send('API Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});