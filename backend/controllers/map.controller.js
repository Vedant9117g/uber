const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// Handle Address Coordinate Request
module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error in getCoordinates:', error.message);
        res.status(404).json({ message: 'Coordinates not found' });
    }
};

// Handle Distance and Time Request
module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    try {
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json({
            origin: { name: origin, coordinates: distanceTime.origin },
            destination: { name: destination, coordinates: distanceTime.destination },
            distance: (distanceTime.distance), // return as number (in meters)
            duration: (distanceTime.duration), // return as number (in seconds)
        });
    } catch (err) {
        console.error('Error in getDistanceTime:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Handle AutoComplete Suggestions Request
module.exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error('Error in getAutoCompleteSuggestions:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
