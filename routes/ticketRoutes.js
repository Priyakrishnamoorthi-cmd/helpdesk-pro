const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = req.user.role === 'admin'
      ? await Ticket.find().populate('createdBy', 'name email')
      : await Ticket.find({ createdBy: req.user.id }).populate('createdBy', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create ticket
router.post('/', auth, async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update ticket
router.put('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ticket
router.delete('/:id', auth, async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;