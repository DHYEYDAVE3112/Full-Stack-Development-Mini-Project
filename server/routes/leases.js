const express = require('express');
const multer = require('multer');
const path = require('path');
const LeaseAgreement = require('../models/LeaseAgreement');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lease-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all lease agreements
router.get('/', auth, async (req, res) => {
  try {
    const leases = await LeaseAgreement.find({ owner: req.user._id })
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create lease agreement
router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
    const leaseData = {
      ...req.body,
      owner: req.user._id
    };
    
    if (req.file) {
      leaseData.documentPath = req.file.path;
    }
    
    const lease = new LeaseAgreement(leaseData);
    await lease.save();
    
    const populatedLease = await LeaseAgreement.findById(lease._id)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address');
    
    res.status(201).json(populatedLease);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update lease agreement
router.put('/:id', auth, upload.single('document'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.documentPath = req.file.path;
    }
    
    const lease = await LeaseAgreement.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('tenant', 'firstName lastName')
     .populate('property', 'name address');
    
    if (!lease) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }
    
    res.json(lease);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Delete lease agreement
router.delete('/:id', auth, async (req, res) => {
  try {
    const lease = await LeaseAgreement.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!lease) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }
    
    res.json({ message: 'Lease agreement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;