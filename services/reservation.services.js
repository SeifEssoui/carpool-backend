const resModel = require("../models/reservation.model");
const schedModel = require("../models/schedule.model");
const routeModel = require("../models/route.model");
const NotificationService = require("./notification.services");
const historyModel= require("../models/history.model");
const {
  reservationCancellationMail,
  scheduleCancellationMail
  
} = require("../template");

exports.getAllReservations = async () => {
  return await resModel.find();
};

exports.getReservationByUser = async (userID) => {
  if (!userID || userID.length != 24) throw Error("Invalid ID was sent");
  return await resModel
    .find({ user: userID })
    .populate("user")  //Amira : ajouter select
    .populate("schedule");
};

exports.getReservationsByDate = async (userID, date) => {
  try {
  
  newDate = new Date (date.substring(0, 10))
  const reservations = await resModel
    .find({
      user: userID,
      date : newDate,
      
    })
    .populate({
      path : "user",
      select : {firstName:1, lastName:1, phoneNumber:1}
    })
    .populate({
      path : "schedule",
      populate: {
        path: "routes",
      },
    })
   
    //.populate("user") 
    //.populate("schedule")
    .exec();

    
  return reservations;
} catch (e) {
  console.log(e);
  throw Error(e.message);
}
};

exports.createReservation = async (params) => {
  try {
   console.log(params);
   schedule= await schedModel.findById(params.schedule).populate({
      path: "routes",
      select: { type: 1 },
   });
   
   console.log("schedule", schedule)
   var reservations = await resModel.find({
    schedule : params.schedule
   }
   )
   var resNumber = reservations.length;
   if (resNumber >= schedule.availablePlaces){
      console.log("no available seats")
      throw new Error('Sorry, someone else booked the last seat'); 
   }else{
    newReservation = await resModel.create({
      user : params.user,
      schedule : params.schedule,
      status : 'pending',
      pickupTime : params.pickupTime,
      date : schedule.scheduledDate,
      routeDirection : schedule.routes.type,
      
    }
    );
    var direction = (schedule.routes.type == "toOffice") ? "To office" : "From Office";
    const history = new historyModel({
      transaction : 'rideReservation',
      user : params.user,
      owner : params.user,
      date : params.pickupTime,
      direction : direction,
      title: "Ride reservation",
      color: "#0B7B59",
      schedule : params.schedule,
      reservation : newReservation._id,

     }
   )
    await history.save();
    return 200          
     
   }
   
  } catch (e) {
    console.log(e);
    throw Error(e.message);
  }
};

exports.updateReservationByID = async (id, updates) => {
  if (!id || id.length != 24 || !updates)
    throw new Error("Requesst was sent with missing params");
  return await resModel.findByIdAndUpdate(id, updates);
};

exports.deleteReservationByID = async (id) => {
 try {
  if (!id || id.length != 24)
    throw new Error("Requesst was sent with missing params");
  reservation = await resModel.findById(
    id).populate({
    path : "user",
    select : {firstName:1, lastName:1, email:1}
    }).populate({
      path : "schedule",
      select : {user:1, scheduledDate:1, startTime:1},
      populate: ("user")
      });


   
    await resModel.findByIdAndDelete(id);
    var text = await reservationCancellationMail(     
      reservation.user.firstName,
      reservation.user.lastName,
      reservation.schedule.scheduledDate,
      reservation.schedule.startTime
    );

     await NotificationService.sendMail(
      reservation.schedule.user.email,
      "WorkPoint Ride Cancellation",
      text
    );

    var notif = await NotificationService.createNotification({
      receiver: reservation.schedule.user._id,
      sender: reservation.user._id,
      message:
      reservation.user.firstName +
        " " +
        reservation.user.lastName +
        " has cancelled reservation on "+
        reservation.schedule.scheduledDate +
        " at "+
        reservation.schedule.startTime,
      title: "Reservation cancellation",
    });
    
    var direction = (reservation.schedule.routeDirection == "toOffice") ? "To office" : "From Office";
    const history = new historyModel({
      transaction : 'reservationCancellation',
      user : reservation.user,
      owner : reservation.user,
      date : reservation.schedule.startTime,
      direction : direction,
      title: "Reservation cancellation",
      color: "#AD2A0E",
      schedule : reservation.schedule._id,
      reservation : reservation._id
  
     }
   )
    await history.save();

  return 200;
} catch (e) {
  console.log(e);
  throw Error(e.message);
}
};
