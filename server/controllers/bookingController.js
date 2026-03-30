import Booking from "..models/Booking.js"
import Car from "../models/Car.js";

// Function to check availability of car for a given data
const checkAvailability = async (Car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        Car, 
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}


// API to check Availability of cars for the given Date and Location 
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {loaction, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location 
        const cars = await Car.find({location, isAvaliable: true})

        // check car availaility for the given data range using promise
        const availabeCarsPromises = cars.map(async (car)=>{
            const availableCarsPromises = await checkAvailability(cars._id, pickupDate, returnDate)
            return {...cars._doc, isAvaliable: isAvaliable}
        })
    
         let availabeCars = await Promise.all(availabeCarsPromises);
         availabeCars = availabeCars.filter(car => car.isAvaliable === true)

         res.json({success: true, availabeCars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvaliable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvaliable){
            return res.json({success: false, message: "Car is not available"})
        }
        const carData = await Car.findById(car)

        // Calculate price based on pickupdate and returndate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user:_id, pickupDate, returnDate, price})

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API ti List User Booking
export const getUserBookings = async (req, res)=> {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user:_id}).populate("car").sort({createdAt: -1})
        res.json({success: true, message: "Booking Created"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}


// API to get Owner Bookings
export const getOwnerBookings = async (req, res)=> {
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unathorized"})
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({created: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}

// Api to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingID, status} = req.body

        const booking = await Booking.findById(bookingID)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
