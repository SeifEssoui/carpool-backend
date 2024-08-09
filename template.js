exports.scheduleCancellationMail = async ( driverFirstName, driverLastName, date, startTime ) => {

    var text = `${driverFirstName} ${driverLastName} has cancelled his ride on ${date} at ${startTime} .`
  
    return text

}


exports.reservationCancellationMail = async ( passengerFirstName, passengerLastName, date, startTime ) => {

    var text = `${passengerFirstName} ${passengerLastName} has cancelled his reservation on ${date} at ${startTime} .`
  
    return text

}
