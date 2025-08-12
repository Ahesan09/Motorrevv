import { Router } from "express";
import multer from "multer";
import path from "path";
import * as carContoller from "../controller/cars.controllers.js";

const router = Router();

router.route("/cars").get(carContoller.getCars)
router.route("/cars").post(carContoller.addCars);

export const carRoutes = router;