const express = require('express');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all maintenance requests
router.get('/', auth, async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ owner: req.user._id })
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    
    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update maintenance request
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('tenant', 'firstName lastName')
     .populate('property', 'name address');
    
    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Delete maintenance request
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;