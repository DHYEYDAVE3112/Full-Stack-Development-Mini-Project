const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const supabase = require('./config/supabase');

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

// Test Supabase connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected initially
      console.error('Supabase connection error:', error);
    } else {
      console.log('Connected to Supabase');
    }
  } catch (err) {
    console.error('Supabase connection test failed:', err.message);
  }
}

testConnection();

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