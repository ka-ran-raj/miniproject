const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  name: { type: String, required: true },
  gatepassType: { type: String, required: true },
  numberOfAdults: { type: Number, required: true },
  numberOfChildren: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
