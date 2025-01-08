const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
      throw new Error('Pickup and destination are required');
    }
  
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
  
    const baseFare = {
      auto: 30,
      car: 50,
      moto: 20
    };
  
    const perKmRate = {
      auto: 10,
      car: 11,
      moto: 8
    };
  
    const perMinuteRate = {
      auto: 2,
      car: 3,
      moto: 1.5
    };
  
    console.log(distanceTime);
  
    const fare = {
      auto: Math.round(baseFare.auto + ((distanceTime.distance / 1000) * perKmRate.auto) + ((distanceTime.duration / 60) * perMinuteRate.auto)),
      car: Math.round(baseFare.car + ((distanceTime.distance / 1000) * perKmRate.car) + ((distanceTime.duration / 60) * perMinuteRate.car)),
      moto: Math.round(baseFare.moto + ((distanceTime.distance / 1000) * perKmRate.moto) + ((distanceTime.duration / 60) * perMinuteRate.moto))
    };
  
    // Ensure the fare values are not NaN
    if (isNaN(fare.auto) || isNaN(fare.car) || isNaN(fare.moto)) {
      throw new Error('Calculated fare is invalid');
    }
  
    return fare;
  }
  

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    console.log(fare);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    return ride;
}