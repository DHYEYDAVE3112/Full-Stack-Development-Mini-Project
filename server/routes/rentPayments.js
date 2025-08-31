const express = require('express');
const RentPayment = require('../models/RentPayment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all rent payments
router.get('/', auth, async (req, res) => {
  try {
    const payments = await RentPayment.find({ owner: req.user._id })
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address')
      .sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create rent payment
router.post('/', auth, async (req, res) => {
  try {
    const payment = new RentPayment({
      ...req.body,
      owner: req.user._id
    });
    
    await payment.save();
    
    const populatedPayment = await RentPayment.findById(payment._id)
      .populate('tenant', 'firstName lastName')
      .populate('property', 'name address');
    
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update payment status
router.put('/:id', auth, async (req, res) => {
  try {
    const payment = await RentPayment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('tenant', 'firstName lastName')
     .populate('property', 'name address');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Delete payment
router.delete('/:id', auth, async (req, res) => {
  try {
    const payment = await RentPayment.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;