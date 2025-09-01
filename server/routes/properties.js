const express = require('express');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all properties with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const query = { owner: req.user._id };

    // Add filters
    if (status) query.status = status;
    if (type) query.type = type;

    const properties = await Property.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      message: 'Properties retrieved successfully',
      data: {
        properties,
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
      message: 'Error fetching properties',
      data: null
    });
  }
});

// Get single property
router.get('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Property retrieved successfully',
      data: { property }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching property',
      data: null
    });
  }
});

// Create property
router.post('/', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user._id
    });
    
    await property.save();
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Update property
router.put('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Delete property
router.delete('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Property deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting property',
      data: null
    });
  }
});

module.exports = router;