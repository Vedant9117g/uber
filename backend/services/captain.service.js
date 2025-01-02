const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType,
}) => {
    return captainModel.create({
        fullname: { firstname, lastname },
        email,
        password,
        vehicle: { color, plate, capacity, vehicleType },
    });
};
