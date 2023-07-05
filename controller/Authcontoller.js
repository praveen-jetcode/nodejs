const { decode } = require("punycode");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Users = require("./../Modal/UserModal");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const sendMails = require("../utils/Email");
const crypto = require("crypto");
const { trusted } = require("mongoose");

const signInJwt = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY ,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user , statusCode , res) =>{
  const token = signInJwt(user._id)
  // stored in cookie
  let cookieOptions = {
    expires: new Date( Date.now() + process.env.EXPIRES_COOKIE * 24 * 60 * 60 * 1000),
    httpOnly:true,
    secure:false
  }
  console.log(cookieOptions , "cookieee");
  // only for productions -- this condtion
  // if("only for productions -- condtions") return cookieOptions.secure = true
  user.password = undefined;
  res.cookie('jwt' , token , cookieOptions);
    res.status(statusCode).json({
      message: "Success",
      token,
      data: {
        user,
      },
    });
}
exports.PostSignup = CatchAsync(async (req, res, next) => {
    const UsersAuth = await Users.create(req.body);
    createSendToken(UsersAuth , 201 , res);
});
exports.login = CatchAsync(async (req, res, next) => {
        const { email, password } = req.body;
        if(!email || !password){
          return next({message:"please enter email and password", Error:400})
        }
        const user = await Users.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password ,user.password))){
          return next({message:"Incorrect email and password", Error:401})
        }
        createSendToken(user , 200 , res);     
});
exports.protect = CatchAsync(async(req , res , next)=>{
  let token ;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
  }
    console.log(token , "token");
    if(!token){
      return next(new AppError("your not logged in! , please login to get access." , 401))
    }
   const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET_KEY);
   console.log(decoded , "decoded");

   const CurrentUsers = await Users.findById(decoded.id);
      if(!CurrentUsers){
        return  next(new AppError('The token belonging to this user does no longer exist.',401))
      }

      if(CurrentUsers.changedPasswordAfter(decode.iat)){
        return next(new AppError("User recently changed password! please login again" ,401))
      }
      req.user = CurrentUsers;
   next();
})
// delete data for rolewise
exports.restrictTo = (...roles) =>{
    return (req , res , next) =>{
      console.log(req.user.role , "req.user.role");
      if(!roles.includes(req.user.role)){
        return next(new AppError("You do not have permission to perform this action" , 403))
      }
      next();
    }
}
exports.forgotPassword = CatchAsync(async(req , res , next) =>{
  const user = await Users.findOne({email:req.body.email});
  if(!user){
    return next(new AppError("There is no user with email address." , 404))
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});
  const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`
  console.log(resetURL , "resetURL");
  const message = `Forgot your password ? Submit a PATCH request with your new password and password confirm to ${resetURL}. /n If you didn't forgot your password, please ignore this email`;

try{
  console.log("renderrrrrrrr");
  await sendMails({
    email: user.email,
    subject:"Your password reset Token (valid for 10min)",
    message
  })
  res.status(200).json({
    success:true,
    message : "token send to email!"
  })
}catch(err){
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({validateBeforeSave: false});
  return next(new AppError("There was an error sending the email. try again later!",500))
}})

exports.resetPassword = CatchAsync(async(req , res , next) =>{
  console.log(req.body , "bodyyyy");
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await Users.findOne({passwordResetToken: hashedToken ,passwordResetExpires:{$gt:Date.now()}})
      console.log(user , "userrrrr");
      if(!user){
        return next(new AppError("Token is Invalid or has expired" , 400))
      }
      console.log(req.body , "req.aaaaaa");
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetExpires = undefined;
      user.passwordResetToken = undefined;
      await user.save();
      createSendToken(user , 200 , res);
})

exports.updatePassword = CatchAsync(async(req , res, err) =>{
  console.log(req.user , "users");
  const user = await Users.findById(req.user.id).select('+password')
  if(!(await user.correctPassword(req.body.currentPassword , user.password))){
      return next(new AppError('your current password is wrong',401))
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  createSendToken(user , 200 , res);
})