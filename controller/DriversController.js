
const CatchAsync = require("../utils/CatchAsync");
const Drivers = require("./../Modal/DriversModal");

exports.Drivers = async (req, res, next) => {
    try {
      const DriversAuth = await Drivers.create(req.body);
      res.status(201).json({
        message: "Success",
        data: {
          drivers: DriversAuth,
        },
      });
    } catch (err) {
      res.status(400).json({
        Error: err.name,
        message: err.message,
      });
    }
  };

  exports.GetDrivers = async (req, res, next) => {
    try {
      const DriversAuth = await Drivers.find();
      res.status(200).json({
        message: "Success",
        data: {
          drivers: DriversAuth,
        },
      });
    } catch (err) {
      res.status(400).json({
        Error: err.name,
        message: err.message,
      });
    }
  };

  exports.deleteDrivers = CatchAsync(async(req , res , next) =>{
        const deleteDrivers = await Drivers.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
            message:"Driver deleted Successfully"
        })
  })