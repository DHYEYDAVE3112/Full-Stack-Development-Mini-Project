const express = require('express');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all tenants with pagination
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { owner: req.user._id };

    if (status) query.status = status;

    const tenants = await Tenant.find(query)
      .populate('property', 'name address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Tenant.countDocuments(query);

    res.json({
      success: true,
      message: 'Tenants retrieved successfully',
      data: {
        tenants,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tenants',
      data: null
    });
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
      return res.status(404).json({ 
        success: false,
        message: 'Tenant not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Tenant retrieved successfully',
      data: { tenant }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tenant',
      data: null
    });
  }
});

// Create tenant
router.post('/', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    // Verify property belongs to user
    const property = await Property.findOne({ 
      _id: req.body.property, 
      owner: req.user._id 
    });
    
    if (!property) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid property',
        data: null
      });
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
    
    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: { tenant: populatedTenant }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Update tenant
router.put('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('property', 'name address');
    
    if (!tenant) {
      return res.status(404).json({ 
        success: false,
        message: 'Tenant not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: { tenant }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Delete tenant
router.delete('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!tenant) {
      return res.status(404).json({ 
        success: false,
        message: 'Tenant not found',
        data: null
      });
    }
    
    // Update property status to vacant
    await Property.findByIdAndUpdate(tenant.property, { status: 'vacant' });
    
    res.json({
      success: true,
      message: 'Tenant deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting tenant',
      data: null
    });
  }
});

module.exports = router;