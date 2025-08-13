import * as carService from "../services/cars.service.js";
import {createCar} from "../services/cars.service.js"
export const getCars = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query || {};
    const result = await carService.getCars({ page, limit, search });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};


export const getCarsById = async(req,res)=>{
  try {
     const id = parseInt(req.params.id);
   const result =  await carService.getCarsById(id);
   if (!result) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(result);
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
export const addCars = async (req, res) => {
  try {
    const carData = req.body;
   if (req.files && req.files.length > 0) {
      // Directly store as array
      carData.image = req.files.map(file => `uploads/${file.filename}`);
    }
    await createCar(carData);
    res.status(201).json({ message: "Car added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const editCars = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    // Start with body data
    const updatedData = { ...req.body };

    if (req.files && req.files.length > 0) {
      // Replace images array with new uploaded files
      updatedData.image = req.files.map(file => `uploads/${file.filename}`);
    } else {
      // No new images uploaded: preserve existing images
      const existingCar = await carService.getCarsById(id);
      if (!existingCar) {
        return res.status(404).json({ message: "Car not found" });
      }
      updatedData.image = existingCar.image || [];
    }

    const updatedCar = await carService.editCars(id, updatedData);

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ car: updatedCar, message: "Car updated successfully" });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};


export const deleteCars = async(req,res)=>{
  try {
     const id = parseInt(req.params.id);
   const result =  await carService.deleteCars(id);
   if (!result) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}