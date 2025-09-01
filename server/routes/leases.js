const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const LeaseAgreement = require('../models/LeaseAgreement');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lease-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all lease agreements
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { owner: req.user._id };

    if (status) query.status = status;

    const leases = await LeaseAgreement.find(query)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await LeaseAgreement.countDocuments(query);

    res.json({
      success: true,
      message: 'Lease agreements retrieved successfully',
      data: {
        leases,
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
      message: 'Error fetching lease agreements',
      data: null
    });
  }
});

// Create lease agreement
router.post('/', auth, authorize('landlord', 'admin'), upload.single('document'), async (req, res) => {
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
    
    res.status(201).json({
      success: true,
      message: 'Lease agreement created successfully',
      data: { lease: populatedLease }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Update lease agreement
router.put('/:id', auth, authorize('landlord', 'admin'), upload.single('document'), async (req, res) => {
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
      return res.status(404).json({ 
        success: false,
        message: 'Lease agreement not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Lease agreement updated successfully',
      data: { lease }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Download lease document
router.get('/:id/download', auth, async (req, res) => {
  try {
    const lease = await LeaseAgreement.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!lease || !lease.documentPath) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        data: null
      });
    }

    const filePath = lease.documentPath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
        data: null
      });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading document',
      data: null
    });
  }
});

// Delete lease agreement
router.delete('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const lease = await LeaseAgreement.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!lease) {
      return res.status(404).json({ 
        success: false,
        message: 'Lease agreement not found',
        data: null
      });
    }

    // Delete associated file if exists
    if (lease.documentPath && fs.existsSync(lease.documentPath)) {
      fs.unlinkSync(lease.documentPath);
    }
    
    res.json({
      success: true,
      message: 'Lease agreement deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting lease agreement',
      data: null
    });
  }
});

module.exports = router;