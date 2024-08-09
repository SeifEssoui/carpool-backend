const scheduleModel = require("../models/schedule.model");
const routeModel = require("../models/route.model");
const Reservation = require("../models/reservation.model");
const NotificationService = require("./notification.services");
const historyModel= require("../models/history.model");
const {
  scheduleCancellationMail,
  
} = require("../template");

exports.getAllSchedule = async () => {
  //console.log(await scheduleModel.find().populate("user").populate("routes"))
  return await scheduleModel.find().populate("user").populate("routes");
};

// exports.getAllSchedule = async () => {
//   schedules = await scheduleModel.find({
//     _id : {$in : [ObjectId("663e3b8f285a747f85feef66"), ObjectId("6641d3bf99911b548d23180c")]}
//   }.populate("user").populate("routes"));
//   console.log(schedules);
//   return schedules;//Amira filtrer le retour user
// };

exports.getScheduleByUser = async (userID) => {
  if (!userID || userID.length != 24) throw Error("Invalid ID was sent");
  return await scheduleModel.findOne({ userId: userID });
};

exports.createSchedule = async (params) => {
  try {
    //console.log("params", params);

    if (params.routeId == undefined) {
      //console.log("params", params);
      //console.log("routesId", params.routeId);
      var routeDirection = params.routeType;
      var route = await routeModel.create({
        user: params.user,
        startPoint: params.startPoint,
        endPoint: params.endPoint,
        duration: params.duration,
        distance: params.distance,
        type: params.routeType,
        polyline: params.polyline,
      });
    } else {
      var route = await routeModel.findById(params.routeId);
      var routeDirection = route.type;
    }
    
    var direction = (routeDirection == "toOffice") ? "To office" : "From Office";
    
    const schedules = [];
    for (const date of params.scheduledDate) {
      
      
      newDate = new Date (date.substring(0, 10));
      
      newStartTime = new Date(params.startTime);
      
      newStartTime.setHours(newStartTime.getHours() + 1)
      

      const schedule = new scheduleModel({
        user: params.user,
        routes: params.routeId ? params.routeId : route._id,
        startTime: newStartTime,
        scheduledDate: newDate,
        availablePlaces: params.availablePlaces,
        routeDirection: routeDirection,
      });

      
      var newSchedule = await schedule.save();

      const history = new historyModel({
        transaction : 'rideScheduling',
        user : params.user,
        owner : params.user,
        date : newStartTime,
        direction : direction,
        title: "Ride scheduling",
        color: "#0B7B59",
        schedule : newSchedule._id,

       }
     )
      await history.save();
      schedules.push(schedule);
    }
    return schedules;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule.");
  }
};

exports.updateScheduleByID = async (id, updates) => {
  if (!id || id.length != 24 || !updates)
    Error("Request was sent with missing params");
  return await scheduleModel.findByIdAndUpdate(id, updates);
};

exports.deleteScheduleByID = async (id) => {
 try {
  if (!id || id.length != 24) Error("Request was sent with missing params");
  var schedule=await scheduleModel.findById(id).populate("user");
 
  var reservations = await Reservation.find({
    schedule : id
  }).populate("user")
  var direction = (schedule.routeDirection == "toOffice") ? "To office" : "From Office";
  
  if (reservations.length>0){
    
    for (const reservation of reservations) {
        var text = await scheduleCancellationMail(
          schedule.user.firstName,
          schedule.user.lastName,
          schedule.scheduledDate,
          schedule.startTime
        );

      await NotificationService.sendMail(
        reservation.user.email,
        "WorkPoint Ride Cancellation",
        text
      );

      var notif = await NotificationService.createNotification({
        receiver: reservation.user,
        sender: schedule.user,
        message:
          schedule.user.firstName +
          " " +
          schedule.user.lastName +
          " has cancelled ride on "+
          schedule.scheduledDate +
          " at "+
          schedule.startTime,
        title: "Ride cancellation",
      });
      await Reservation.findByIdAndDelete(reservation._id);

      const history = new historyModel({
        transaction : 'reservationCancellation',
        user : reservation.user,
        owner : schedule.user._id,
        date : schedule.startTime,
        direction : direction,
        title: "Reservation cancellation",
        color: "#AD2A0E",
        schedule : schedule._id,
        reservation : reservation._id
    
       }
     )
      await history.save();
      
    }
  }

  
  await scheduleModel.findByIdAndDelete(id);
  const history = new historyModel({
    transaction : 'rideCancellation',
    user : schedule.user._id,
    owner : schedule.user._id,
    date : schedule.startTime,
    direction : direction,
    title: "Ride cancellation",
    color: "#AD2A0E",
    schedule : schedule._id,

   }
 )
  await history.save();
  
  return 200;
  
  } catch (error) {
    console.error("Error while deleting schedule", error);
    throw error;
  }
};
exports.findNearestPolyline = async (body) => {
  try {
    console.log('bodyyyy',body)
    var newDate = new Date (body.date.substring(0, 10));
    
    
    var foundRoutes = await scheduleModel.find({
      scheduledDate : newDate,
      routeDirection : body.type
    }

    ).populate({
      path: "user",
      select: { firstName: 1, lastName: 1, phoneNumber: 1 },
    }).populate("routes");

    console.log('foundRoutes', foundRoutes)

    // const point = {
    //   longitude: 36.67292,
    //   latitude: 10.95815,
    // }; // Example point coordinates
    // const startDate = new Date("2023-01-01"); // Example scheduled date
    // const endDate = new Date("2026-01-01");
    // console.log("startDate", startDate);
    
    // const nearestRoute = await scheduleModel.aggregate([
    //   {
    //     $match: {
    //       scheduledDate: { $gte: startDate, $lte: endDate }, // Filter by scheduled date between two dates
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "routes",
    //       localField: "routes",
    //       foreignField: "_id",
    //       as: "route",
    //     },
    //   },
    //   {
    //     $unwind: "$route",
    //   },
    //   {
    //     $addFields: {
    //       distances: {
    //         $map: {
    //           input: "$route.polyline",
    //           as: "point",
    //           in: {
    //             $let: {
    //               vars: {
    //                 lon1: { $arrayElemAt: ["$$point", 0] },
    //                 lat1: { $arrayElemAt: ["$$point", 1] },
    //                 lon2: point.longitude,
    //                 lat2: point.latitude,
    //                 earthRadius: 6371, // Earth radius in kilometers
    //               },
    //               in: {
    //                 $multiply: [
    //                   {
    //                     $multiply: [
    //                       {
    //                         $sin: {
    //                           $degreesToRadians: {
    //                             $divide: [
    //                               { $subtract: ["$$lat2", "$$lat1"] },
    //                               2,
    //                             ],
    //                           },
    //                         },
    //                       },
    //                       {
    //                         $sin: {
    //                           $degreesToRadians: {
    //                             $divide: [
    //                               { $subtract: ["$$lon2", "$$lon1"] },
    //                               2,
    //                             ],
    //                           },
    //                         },
    //                       },
    //                     ],
    //                   },
    //                   2,
    //                   "$$earthRadius",
    //                 ],
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       user: 1,
    //       routes: 1,
    //       startTime: 1,
    //       scheduledDate: 1,
    //       availablePlaces: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       __v: 1,
    //       route: 1,
    //       distance: { $min: "$distances" }, // Find the minimum distance from the distances array
    //     },
    //   },
    //   {
    //     $sort: { distance: 1 }, // Sort by distance in ascending order
    //   },
    // ]);

    //console.log("nnnnnnn", nearestRoute);
    // Return the nearest polyline
    //return nearestRoute;
    return foundRoutes;
  } catch (error) {
    console.error("Error finding nearest polyline:", error);
    throw error;
  }
};
exports.getSchedulesWithReservationsByDate = async (date, userID) => {
  // Create date objects to cover the whole day from start to end
  console.log("date", date);
  console.log("userID", userID);

  const newDate = new Date(date);
  // newDate.setHours(0, 0, 0, 0);
  // newDate.setDate(newDate.getDate() + 1);
  // console.log("newDate", newDate);
  //newDate = new Date (date.substring(0, 10))
  const schedules = await scheduleModel
    .find({
      user: userID,
      scheduledDate: newDate,
    })
    .populate("routes")
    .exec();
  // console.log("scheduleseeeeeeeeeeeeeeeee", schedules);
  // Make sure to call exec() to properly execute the query
  // Attach reservations to each schedule
  const schedulesWithReservations = await Promise.all(
    schedules.map(async (schedule) => {
      const reservations = await Reservation.find({ schedule: schedule._id })
        .populate({
          path: "user",
          select: { firstName: 1, lastName: 1, phoneNumber: 1 },
        })
        .exec();
      console.log("reservations", reservations);

      return {
        ...schedule.toObject(), // Convert mongoose document to a plain object
        reservations,
      };
    })
  );
  return schedulesWithReservations;
};
