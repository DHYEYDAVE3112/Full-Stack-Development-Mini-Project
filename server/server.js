const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const tenantRoutes = require('./routes/tenants');
const rentPaymentRoutes = require('./routes/rentPayments');
const maintenanceRoutes = require('./routes/maintenance');
const leaseRoutes = require('./routes/leases');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/rent-payments', rentPaymentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/leases', leaseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'RentEase API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});