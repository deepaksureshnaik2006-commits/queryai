require('dotenv').config();
const express = require('express');
const cors = require('cors');

const optimizeRoutes = require('./routes/optimize');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/optimize', optimizeRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
  res.send('QueryAI Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
