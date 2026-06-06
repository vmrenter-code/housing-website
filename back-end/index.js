const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET || 'TEMP_KEY';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
});

app.set('io', io);

/* --- Middleware --- */
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Allow the server to accept and parse JSON in request bodies
app.use(express.json());

/* --- MongoDB Connection using Mongoose --- */
mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Successfully connected to MongoDB!"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('No token, authorization denied'));
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Token is not valid'));
    }
});

io.on('connection', (socket) => {
    if (socket.user?.id) {
        socket.join(`user:${socket.user.id}`);
    }

    socket.on('disconnect', () => {
        // no-op: rooms are cleaned up automatically
    });
});

/* --- API Routes --- */
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/saved-listings', require('./routes/savedListings'));

// A simple root route to test if the server is up
app.get('/', (req, res) => {
    res.send('API Server is running!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});