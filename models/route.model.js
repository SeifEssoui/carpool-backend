// const mongoose = require('mongoose');

// const RouteSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     startPoint: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             required: true
//         },
//         coordinates: {
//             type: [Double],
//             required: true
//         }
//     },
//     endPoint: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             required: true
//         },
//         coordinates: {
//             type: [Double],
//             required: true
//         }
//     },
//     polyline: {
//         type: String, // Store the polyline encoded string here
//         required: true
//     },
//     startTime: {
//         type: Date,
//         required: true
//     },
//     daysOfWeek: {
//         type: [String], // Example: ['Monday', 'Wednesday']
//         required: true
//     },
//     duration: {
//         type: Number, // Duration in minutes
//         required: true
//     },
//     distance: {
//         type: Number, // Distance in kilometers
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ['aller', 'retour'],
//         required: true
//     }
// });

// // Indexes
// RouteSchema.index({ startPoint: '2dsphere' });
// RouteSchema.index({ endPoint: '2dsphere' });

// // Create model
// const Route = mongoose.model('Route', RouteSchema);

// module.exports = Route;

const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startPoint: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    endPoint: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    duration: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["fromOffice", "toOffice"],
      required: true,
    },
    polyline: {
      type: [[Number]], // Corrected type for polyline
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
RouteSchema.index({ startPoint: "2dsphere" });
RouteSchema.index({ endPoint: "2dsphere" });

module.exports = mongoose.model("Route", RouteSchema);
