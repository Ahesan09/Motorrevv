import { Router } from "express";
import multer from "multer";
import path from "path";
import * as carContoller from "../controller/cars.controllers.js";
import upload from "../middleware/upload.js";

const router = Router();

router.route("/get-cars").get(carContoller.getCars)
router.route("/get-cars/:id").get(carContoller.getCarsById);
router.route("/add-cars").post(upload.array("image"),carContoller.addCars);
router.route("/edit-cars/:id").post(upload.array("image"),carContoller.editCars);
router.route("/delete-cars/:id").post(carContoller.deleteCars);



export const carRoutes = router;