const axios = require('axios');
const captainModel = require('../models/captain.model');

const BASE_URL = 'https://api.openrouteservice.org';

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.ORS_API_KEY;
  const url = `${BASE_URL}/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;

  try {
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates;
      return {
        lng: location[0],
        ltd: location[1],
      };
    } else {
      throw new Error('Unable to fetch coordinates');
    }
  } catch (error) {
    console.error('Error in getAddressCoordinate:', error.message);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const apiKey = process.env.ORS_API_KEY;

  const originCoords = await module.exports.getAddressCoordinate(origin);
  const destinationCoords = await module.exports.getAddressCoordinate(destination);

  const body = {
    locations: [
      [originCoords.lng, originCoords.ltd],
      [destinationCoords.lng, destinationCoords.ltd],
    ],
    metrics: ['duration', 'distance'],
    units: 'm',
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/v2/matrix/driving-car`,
      body,
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.durations && response.data.distances) {
      return {
        origin: originCoords,
        destination: destinationCoords,
        duration: Math.ceil(response.data.durations[0][1]), // Ceil duration
        distance: Math.ceil(response.data.distances[0][1]), // Ceil distance
      };
    } else {
      throw new Error('Unable to fetch distance and time');
    }
  } catch (error) {
    console.error('Error in getDistanceTime:', error.message);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  const apiKey = process.env.ORS_API_KEY;
  const url = `${BASE_URL}/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(input)}`;

  try {
    const response = await axios.get(url);
    if (response.data.features) {
      return response.data.features.map((feature) => feature.properties.label);
    } else {
      throw new Error('Unable to fetch suggestions');
    }
  } catch (error) {
    console.error('Error in getAutoCompleteSuggestions:', error.message);
    throw error;
  }
};


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

  // radius in km


  const captains = await captainModel.find({
      location: {
          $geoWithin: {
              $centerSphere: [ [ ltd, lng ], radius / 6371 ]
          }
      }
  });

  return captains;


}