const express = require('express');
const User = require('../models/user.model');
const Route = require('../models/route.model');
const router = express.Router();

// API endpoint for searching nearest driver route
router.get('/nearest-driver-route', async (req, res) => {
    try {
        const { userId, locationType, locationName } = req.query;

        // Get the user's favorite places based on userId
        let userFavorites;
        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            userFavorites = user.favoritePlaces;
        }

        // Determine the search location based on locationType
        let searchLocation;
        if (locationType === 'current') {
            // Handle searching based on user's current location (not implemented here)
            // You may use geolocation or IP-based location detection to get the current location
            // For simplicity, let's assume the user's current location is passed in the request
            const { latitude, longitude } = req.query;
            searchLocation = { type: 'Point', coordinates: [longitude, latitude] };
        } else if (locationType === 'favorite') {
            // Handle searching based on one of the user's favorite locations
            const favoriteLocation = userFavorites.find(place => place.name === locationName);
            if (!favoriteLocation) {
                return res.status(404).json({ error: 'Favorite location not found' });
            }
            searchLocation = favoriteLocation.location;
        } else {
            return res.status(400).json({ error: 'Invalid location type' });
        }

        // Perform a geospatial query to find the nearest driver route
        const nearestDriverRoute = await Route.findOne({
            startPoint: { $near: { $geometry: searchLocation } }
        }).populate('user'); // Assuming 'user' field in Route model references the driver

        if (!nearestDriverRoute) {
            return res.status(404).json({ error: 'No nearest driver route found' });
        }

        res.json({ nearestDriverRoute });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
