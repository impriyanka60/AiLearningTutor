const dotenv = require('dotenv');
dotenv.config(); // ✅ Load .env before anything else
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
//mongoose.connect(process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const tutorRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
 // This creates /api/auth/login




const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api', tutorRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
