const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Ticket = require('./models/Ticket'); // Assuming you have a Ticket model

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/gatepass', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// User signup endpoint
app.post('/api/users/signup', async (req, res) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    const result = await user.save();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// User login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true, name: user.name });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, error: error.message });
  }
});

// Save profile details endpoint
app.post('/api/profile-details', async (req, res) => {
  try {
    const profileData = req.body;
    // Assuming you have authentication middleware to retrieve phoneNumber from token or session
    const user = await User.findOne({ phoneNumber: profileData.phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Update user's profile details
    user.profile = profileData;
    const result = await user.save();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save ticket details endpoint
app.post('/api/tickets', async (req, res) => {
  try {
    const ticketData = req.body;
    const ticket = new Ticket(ticketData);
    const result = await ticket.save();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user details by phoneNumber endpoint
app.get('/api/users', (req, res) => {
  const { phoneNumber } = req.query;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }
  User.findOne({ phoneNumber })
    .then(user => {
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});
app.get('/api/tickets', (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  Ticket.find({ phoneNumber })
    .then(tickets => res.status(200).json({ success: true, data: tickets }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
