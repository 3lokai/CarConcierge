const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_concierge';
const JWT_SECRET = 'your_jwt_secret'; // In a real app, use an environment variable

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Car model
const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  color: String,
  interior: String,
  price: Number,
  image: String
});

const Car = mongoose.model('Car', CarSchema);

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cars', auth, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cars/search', auth, async (req, res) => {
  const { make, model, year, color, interior } = req.body;
  const query = {};
  if (make) query.make = new RegExp(make, 'i');
  if (model) query.model = new RegExp(model, 'i');
  if (year) query.year = year;
  if (color) query.color = new RegExp(color, 'i');
  if (interior) query.interior = new RegExp(interior, 'i');

  try {
    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize database with sample data
const initDatabase = async () => {
  try {
    await Car.deleteMany({});
    await Car.insertMany([
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'Silver',
        interior: 'Black',
        price: 25000,
        image: 'https://example.com/toyota-camry.jpg'
      },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        color: 'Blue',
        interior: 'Gray',
        price: 22000,
        image: 'https://example.com/honda-civic.jpg'
      },
      {
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        color: 'Red',
        interior: 'Black',
        price: 35000,
        image: 'https://example.com/ford-mustang.jpg'
      }
    ]);
    console.log('Sample car data inserted');

    // Create test user
    const testUser = await User.findOne({ username: 'test' });
    if (!testUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test', salt);
      await User.create({ username: 'test', password: hashedPassword });
      console.log('Test user created');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});