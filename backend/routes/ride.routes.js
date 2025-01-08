const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

console.log('Ride routes file loaded at runtime');

// Test Routes
router.get('/test', (req, res) => {
  console.log('Test route triggered');
  res.send('Rides router is working!');
});

router.get('/', (req, res) => {
  res.send('Rides router working!');
});

// Create Ride Route
router.post(
  '/create',
  authMiddleware.authUser, // Ensure this middleware is working
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
  body('vehicleType')
    .isString()
    .isIn(['auto', 'car', 'moto'])
    .withMessage('Invalid vehicle type'),
  (req, res, next) => {
    // Log validation results
    console.log('Validation passed for /create');
    next();
  },
  rideController.createRide
);

// Get Fare Route
router.get(
  '/get-fare',
//   authMiddleware.authUser, // Ensure this middleware is working
  query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
  (req, res, next) => {
    // Log validation results
    console.log('Validation passed for /get-fare');
    next();
  },
  rideController.getFare
);

module.exports = router;
