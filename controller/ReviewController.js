const ReviewSchema = require("../Modal/ReviewModal");
const createAsync = require("../utils/CatchAsync");

exports.getAllReviews = createAsync(async(req , res , next) =>{
        const Reviews = await ReviewSchema.find();
        res.status(200).json({
            success:true,
            data:{
                reviews:Reviews
            }
        })
});

exports.createReview = createAsync(async(req , res , next) =>{
    if(!req.body.bus) req.body.bus = req.params.busId;
    if(!req.body.drivers) req.body.drivers = req.user._id;
        const data = await ReviewSchema.create(req.body);
        res.status(200).json({
            success:true,
            data
        })
})