import express from "express";
import Booking from "../models/Booking.js";
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

BookingRouter.post('/check-availability', checkAvailabilityOfCar)
BookingRouter.post('/create', protect, createBooking)
BookingRouter.get('/user', protect, getUserBookings)
BookingRouter.get('/owner', protect, getOwnerBookings)
BookingRouter.post('/create', protect, changeBookingStatus)

export default bookingRouter;