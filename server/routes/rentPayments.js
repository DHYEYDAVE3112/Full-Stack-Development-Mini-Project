const express = require('express');
const RentPayment = require('../models/RentPayment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all rent payments with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, tenantId, propertyId } = req.query;
    const query = { owner: req.user._id };

    // Add filters
    if (status) query.status = status;
    if (tenantId) query.tenant = tenantId;
    if (propertyId) query.property = propertyId;

    const payments = await RentPayment.find(query)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: -1 });

    const total = await RentPayment.countDocuments(query);

    res.json({
      success: true,
      message: 'Rent payments retrieved successfully',
      data: {
        payments,
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
      message: 'Error fetching rent payments',
      data: null
    });
  }
});

// Create rent payment
router.post('/', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const payment = new RentPayment({
      ...req.body,
      owner: req.user._id
    });
    
    await payment.save();
    
    const populatedPayment = await RentPayment.findById(payment._id)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address');
    
    res.status(201).json({
      success: true,
      message: 'Rent payment created successfully',
      data: { payment: populatedPayment }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Update payment status
router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If marking as paid, set paidDate
    if (updateData.status === 'paid' && !updateData.paidDate) {
      updateData.paidDate = new Date();
    }

    const payment = await RentPayment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('tenant', 'firstName lastName')
     .populate('property', 'name address');
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: { payment }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Validation error',
      data: { error: error.message }
    });
  }
});

// Delete payment
router.delete('/:id', auth, authorize('landlord', 'admin'), async (req, res) => {
  try {
    const payment = await RentPayment.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Payment deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting payment',
      data: null
    });
  }
});

// Get payment statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalPaid = await RentPayment.aggregate([
      { $match: { owner: req.user._id, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingCount = await RentPayment.countDocuments({ 
      owner: req.user._id, 
      status: 'pending' 
    });

    const lateCount = await RentPayment.countDocuments({ 
      owner: req.user._id, 
      status: 'late' 
    });

    res.json({
      success: true,
      message: 'Payment statistics retrieved successfully',
      data: {
        totalCollected: totalPaid[0]?.total || 0,
        pendingPayments: pendingCount,
        latePayments: lateCount
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching payment statistics',
      data: null
    });
  }
});

module.exports = router;