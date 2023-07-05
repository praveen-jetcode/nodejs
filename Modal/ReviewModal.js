const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviews: {
    type: String,
    require: [true, "review cant be empty "],
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bus: {
    type: mongoose.Schema.ObjectId,
    ref: "Bus",
    // require: [true, "Review must belong to a Bus"],
  },
  drivers: {
    type: mongoose.Schema.ObjectId,
    ref: "Drivers",
    // require: [true, "Reivew must belong to a Drivers"],
  },
});

ReviewSchema.pre(/^find/, function (next) {
    // bus and drivers
//   this.populate({ path: "bus", select: "name" }).populate({
//     path: "drivers",
//     select: "name",
//   });

// only drivers list
this.populate({
    path: "drivers",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
