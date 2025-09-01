const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const Tenant = require('./models/Tenant');
const RentPayment = require('./models/RentPayment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const LeaseAgreement = require('./models/LeaseAgreement');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Tenant.deleteMany({});
    await RentPayment.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await LeaseAgreement.deleteMany({});

    console.log('Cleared existing data');

    // Create demo user
    const demoUser = new User({
      username: 'demo_landlord',
      email: 'demo@rentease.com',
      password: 'password123',
      role: 'landlord'
    });
    await demoUser.save();
    console.log('Created demo user');

    // Create properties
    const properties = [
      {
        name: 'Sunset Apartments #12A',
        address: {
          street: '123 Sunset Boulevard',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90028'
        },
        type: 'apartment',
        monthlyRent: 2500,
        status: 'occupied',
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        description: 'Modern apartment with city views',
        owner: demoUser._id
      },
      {
        name: 'Oak Street House',
        address: {
          street: '456 Oak Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102'
        },
        type: 'house',
        monthlyRent: 4500,
        status: 'occupied',
        bedrooms: 3,
        bathrooms: 2.5,
        squareFootage: 1800,
        description: 'Charming Victorian house',
        owner: demoUser._id
      },
      {
        name: 'Downtown Loft #5B',
        address: {
          street: '789 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        type: 'condo',
        monthlyRent: 3200,
        status: 'vacant',
        bedrooms: 1,
        bathrooms: 1,
        squareFootage: 900,
        description: 'Modern loft in downtown area',
        owner: demoUser._id
      }
    ];

    const createdProperties = await Property.insertMany(properties);
    console.log('Created properties');

    // Create tenants
    const tenants = [
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        property: createdProperties[0]._id,
        leaseStartDate: new Date('2024-01-01'),
        leaseEndDate: new Date('2024-12-31'),
        monthlyRent: 2500,
        securityDeposit: 2500,
        status: 'active',
        emergencyContact: {
          name: 'John Johnson',
          phone: '(555) 987-6543',
          relationship: 'Spouse'
        },
        owner: demoUser._id
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        phone: '(555) 234-5678',
        property: createdProperties[1]._id,
        leaseStartDate: new Date('2024-03-01'),
        leaseEndDate: new Date('2025-02-28'),
        monthlyRent: 4500,
        securityDeposit: 4500,
        status: 'active',
        emergencyContact: {
          name: 'Lisa Chen',
          phone: '(555) 876-5432',
          relationship: 'Sister'
        },
        owner: demoUser._id
      }
    ];

    const createdTenants = await Tenant.insertMany(tenants);
    console.log('Created tenants');

    // Create rent payments
    const rentPayments = [
      {
        tenant: createdTenants[0]._id,
        property: createdProperties[0]._id,
        amount: 2500,
        dueDate: new Date('2025-02-01'),
        status: 'pending',
        paymentMethod: 'online',
        owner: demoUser._id
      },
      {
        tenant: createdTenants[1]._id,
        property: createdProperties[1]._id,
        amount: 4500,
        dueDate: new Date('2025-02-01'),
        status: 'paid',
        paidDate: new Date('2025-01-28'),
        paymentMethod: 'bank_transfer',
        owner: demoUser._id
      },
      {
        tenant: createdTenants[0]._id,
        property: createdProperties[0]._id,
        amount: 2500,
        dueDate: new Date('2025-01-01'),
        status: 'paid',
        paidDate: new Date('2024-12-30'),
        paymentMethod: 'online',
        owner: demoUser._id
      }
    ];

    await RentPayment.insertMany(rentPayments);
    console.log('Created rent payments');

    // Create maintenance requests
    const maintenanceRequests = [
      {
        property: createdProperties[0]._id,
        tenant: createdTenants[0]._id,
        title: 'Leaking faucet in kitchen',
        description: 'The kitchen faucet has been dripping constantly for the past week.',
        priority: 'medium',
        status: 'open',
        category: 'plumbing',
        owner: demoUser._id
      },
      {
        property: createdProperties[1]._id,
        tenant: createdTenants[1]._id,
        title: 'Heating system not working',
        description: 'The heating system stopped working yesterday evening.',
        priority: 'high',
        status: 'in_progress',
        category: 'hvac',
        assignedTo: 'ABC Heating Services',
        estimatedCost: 350,
        owner: demoUser._id
      },
      {
        property: createdProperties[0]._id,
        tenant: createdTenants[0]._id,
        title: 'Broken window in bedroom',
        description: 'Window pane cracked due to storm damage.',
        priority: 'low',
        status: 'resolved',
        category: 'structural',
        assignedTo: 'Glass Repair Co',
        estimatedCost: 200,
        actualCost: 180,
        completedDate: new Date('2025-01-15'),
        owner: demoUser._id
      }
    ];

    await MaintenanceRequest.insertMany(maintenanceRequests);
    console.log('Created maintenance requests');

    // Create lease agreements
    const leaseAgreements = [
      {
        tenant: createdTenants[0]._id,
        property: createdProperties[0]._id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        monthlyRent: 2500,
        securityDeposit: 2500,
        terms: 'Standard residential lease agreement. Tenant agrees to pay rent on the 1st of each month. No pets allowed. Smoking prohibited.',
        status: 'active',
        owner: demoUser._id
      },
      {
        tenant: createdTenants[1]._id,
        property: createdProperties[1]._id,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        monthlyRent: 4500,
        securityDeposit: 4500,
        terms: 'Residential lease for single-family home. Tenant responsible for lawn maintenance. One small pet allowed with additional deposit.',
        status: 'active',
        owner: demoUser._id
      }
    ];

    await LeaseAgreement.insertMany(leaseAgreements);
    console.log('Created lease agreements');

    console.log('✅ Database seeded successfully!');
    console.log('Demo credentials:');
    console.log('Email: demo@rentease.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();