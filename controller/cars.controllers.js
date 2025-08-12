import * as carService from "../services/cars.service.js";
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


export const addCars = async (req, res) => {
  try {
    const carData = req.body;
    await createCar(carData);
    res.status(201).json({ message: "Car added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
