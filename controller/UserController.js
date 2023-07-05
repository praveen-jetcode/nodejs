const Users = require("../Modal/UserModal");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((res) => {
    if (allowedFields.includes(res)) {
      newObj[res] = obj[res];
    }
  });
  return newObj;
};

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    success: true,
    data: {
      users,
    },
  });
});

exports.updateUsers = CatchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route not for update password!. please use /updatepassword",
        400
      )
    );
  }
  const filterBody = filterObj(req.body, "email", "name");
  const user = await Users.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

exports.deleteUsers = CatchAsync(async(req, res, next)=>{
    await Users.findByIdAndUpdate(req.user.id ,{active:false})
    res.status(200).json({
        success:true,
        data:null
    })
})