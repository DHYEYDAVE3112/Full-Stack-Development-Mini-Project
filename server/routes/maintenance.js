const express = require('express');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all maintenance requests with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, propertyId } = req.query;
    const query = { owner: req.user._id };

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (propertyId) query.property = propertyId;

    const requests = await MaintenanceRequest.find(query)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MaintenanceRequest.countDocuments(query);

    res.json({
      success: true,
      message: 'Maintenance requests retrieved successfully',
      data: {
        requests,
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
      message: 'Error fetching maintenance requests',
      data: null
    });
  }
});

// Create maintenance request
router.post('/', auth, async (req, res) => {
  try {
    const request = new MaintenanceRequest({
      ...req.body,
      owner: req.user._id
    });
    
    await request.save();
    
    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address');
    
    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: { request: populatedRequest }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Update maintenance request
router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If marking as resolved, set completedDate
    if (updateData.status === 'resolved' && !updateData.completedDate) {
      updateData.completedDate = new Date();
    }

    const request = await MaintenanceRequest.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('tenant', 'firstName lastName')
     .populate('property', 'name address');
    
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Maintenance request not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Maintenance request updated successfully',
      data: { request }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Delete maintenance request
router.delete('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Maintenance request not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Maintenance request deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting maintenance request',
      data: null
    });
  }
});

module.exports = router;