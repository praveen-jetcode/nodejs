const mongoose = require("mongoose");
const Drivers = require("./DriversModal");
const Review = require("../Modal/ReviewModal");
const BusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    busDrivers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Drivers",
      },
    ]
  }
);
// virtual populate
BusSchema.virtual('review',{
  ref:'Review',
  foreignField:'bus',
  localField:'_id'
})
//********* using populate in middleware *******//
BusSchema.pre(/^find/, function (next) {
  this.populate({
    path: "busDrivers",
    select: "-__v",
  });
  next();
});
BusSchema.set('toObject', { virtuals: true });
BusSchema.set('toJSON', { virtuals: true });
// BusSchema.pre("save", async function(next) {
//   const busPromises = this.busDrivers.map(async(id) => await Drivers.findById(id));
//     this.busDrivers = await Promise.all(busPromises);
//     next();
// });
const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
