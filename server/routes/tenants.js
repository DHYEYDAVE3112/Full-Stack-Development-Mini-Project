const express = require('express');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tenants
router.get('/', auth, async (req, res) => {
  try {
    const tenants = await Tenant.find({ owner: req.user._id })
      .populate('property', 'name address');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single tenant
router.get('/:id', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    }).populate('property');
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create tenant
router.post('/', auth, async (req, res) => {
  try {
    // Verify property belongs to user
    const property = await Property.findOne({ 
      _id: req.body.property, 
      owner: req.user._id 
    });
    
    if (!property) {
      return res.status(400).json({ message: 'Invalid property' });
    }

    const tenant = new Tenant({
      ...req.body,
      owner: req.user._id
    });
    
    await tenant.save();
    
    // Update property status to occupied
    await Property.findByIdAndUpdate(req.body.property, { status: 'occupied' });
    
    const populatedTenant = await Tenant.findById(tenant._id)
      .populate('property', 'name address');
    
    res.status(201).json(populatedTenant);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update tenant
router.put('/:id', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('property', 'name address');
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Delete tenant
router.delete('/:id', auth, async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Update property status to vacant
    await Property.findByIdAndUpdate(tenant.property, { status: 'vacant' });
    
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;