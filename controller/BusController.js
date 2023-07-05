const Bus = require("../Modal/BusModal");
const CatchAsync = require("../utils/CatchAsync");

const sendResponse = (data , statusCode , res) =>{
    console.log(data , "data");

    res.status(statusCode).json({
        sucess:true,
        data
    })
}
exports.getBus = CatchAsync(async(req , res , next) =>{
    const bus = await Bus.find()
     sendResponse(bus , 200 , res);
})
exports.getbusById = CatchAsync(async(req , res , next) =>{
    const bus = await Bus.findById(req.params.id).populate('review')
    console.log(bus , "req.params");
    sendResponse(bus , 200 , res);
})
exports.addBus = CatchAsync(async(req,res,next)=>{
    const bus = await Bus.create(req.body);
    sendResponse(bus , 201 , res);
})

