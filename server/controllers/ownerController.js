import { format } from "path";
import imagekit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";


// API to change role of user
export const changeRoleToOwner = async (req, res,)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to list Car

export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const responsse = await imagekit.upload({
            file: fileBuffer,
            fileName : imageFile.originalname,
            folder: '/cars'
        })

        // optimize through imagekit URl transformation
        var optimizeImageUrl = imagekit.url({
            path : "/default-image.jpg",
            trasformation : [
                {width: '1280'}, //width resizing
                {quality: 'auto'}, //Auto compression
                { format: 'webp' } // convert to modern format
            ]
        });

        const image = optimizeImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: "Car Added"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// API to list owner car
export const getOwnerCar = async (req, res)=> {
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner:_id})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to toggle car availability
export const toggleCarAvailability = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"});
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to delete car
export const deleteCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"});
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const {_id, role} = req.user;

        if(role !== 'owner'){
            return res.json({success: false, message: "Unauthorized"})
        }

        const cars = await Car.find({owner: _id})
    } catch (error) {
        console.log(error.message);
        req.json({success: false, message: error.message})
    }
}