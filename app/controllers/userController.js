const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')


var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


/* Models */
const UserModel = mongoose.model('User')


/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user



let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


//forget passsword


let forgetPassword = (req,res,next) => {

    async.waterfall([

        function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
      },

      function(token, done) {
        UserModel.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            //req.flash('error', 'No account with that email address exists.');
            console.log("from the userfindone user accound not found");
            //return res.redirect('/forgot');
            let apiResponse = response.generate(true, 'No user found', 404, null);
            res.send(apiResponse)
        }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
           console.log("user found trying to reset the password");
            user.save(function(err) {
        console.log("saving the password");
          done(err, token, user);
        });
      });
      },

      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'meetingplanner11@gmail.com',
            pass: "Google@98"
          }
        });

        var mailOptions = {
            to: user.email,
            from: 'meetingplanner11@gmail.com',
            subject: 'Meeting planner Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'www.webcloud360.com/resetPassword/'  + token + '\n' +'or \n'+
              'http://webcloud360.com/resetPassword/'  + token+ '\n\n'+
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            //req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            let apiResponse = response.generate(false, 'Email is send', 200, null);
            res.send(apiResponse)
            done(err, 'done');
          });
    }
    ], function(err) {
        if (err) return next(err);
       // res.redirect('/forgot');
       let apiResponse = response.generate(true, 'error on call back', 500, null);
            res.send(apiResponse)
    });
    


}

let resetPass = (req,res) => {
    UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          //req.flash('error', 'Password reset token is invalid or has expired.');
          //return res.redirect('/forgot');
          let apiResponse = response.generate(true, 'Password reset token is invalid or has expired', 404, null);
          res.send(apiResponse)
        }
        //res.render('reset', {token: req.params.token});
        let apiResponse = response.generate(false, 'Email is send', 200, user);
            res.send(apiResponse)
    });
}


let resetpassword111 = (req,res) => {

    async.waterfall([

        function(done) {
            UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if (!user) {
               // req.flash('error', 'Password reset token is invalid or has expired.');
                //return res.redirect('back');
                console.log("from the userfindone user accound not found");
            //return res.redirect('/forgot');
            let apiResponse = response.generate(true, 'No user found', 404, null);
            res.send(apiResponse)
      }
      if(req.body.password === req.body.confirm) {
        console.log("inside the set password");
        //user.password=req.body.password;
        console.log("hash password:"+passwordLib.hashpassword(req.body.password));
       user.password = passwordLib.hashpassword(req.body.password);
       console.log("hash pass:"+ user.password);

//-------------------



//-----------

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            console.log("set password");
          // req.logIn(user, function(err) {
            done(err, user);
          
          //});
        })
      } else {
          //req.flash("error", "Passwords do not match.");
          //return res.redirect('back');
          console.log("error on comparing password");
          let apiResponse = response.generate(true, 'No user found', 404, null);
          res.send(apiResponse)
      }
    });
},
function(user, done) {
    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'meetingplanner11@gmail.com',
        pass: "Google@98"
      }
    });
    var mailOptions = {
      to: user.email,
      from: 'meetingplanner11@gmail.com',
      subject: 'Your password has been changed',
      text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
      //req.flash('success', 'Success! Your password has been changed.');
      let apiResponse = response.generate(false, 'Success! Your password has been changed', 200, null);
      res.send(apiResponse)
      done(err);
    });
}
    ], function(err) {
        if (err) return next(err);
       // res.redirect('/forgot');
       let apiResponse = response.generate(true, 'error on call back', 500, null);
            res.send(apiResponse)
    });
}




//end of the forget password



// start user signup function 

let signUpFunction = (req, res) => {


 let  validateUserInput = () => {
     return new Promise((resolve,reject) => {

    
      if(req.body.email){
           if(!validateInput.Email(req.body.email)){
            let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
            reject(apiResponse)
           }
           else if(check.isEmpty(req.body.password)){
            let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
            reject(apiResponse)
           }
           else{
            resolve(req)
           }
      }
      else{
        logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
        let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
        reject(apiResponse)
      }
    })

 }//end of valdate user input


 let createUser = () => {

  return new Promise((resolve,reject) => {

    UserModel.findOne({email:req.body.email})
    .exec((err,result) => {
        if(err){
            logger.error(err.message, 'userController: createUser', 10)
            let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
            reject(apiResponse)
        }
        else if(check.isEmpty(result)){
           
            let newUser = new UserModel({

                userId: shortid.generate(),
                firstName: req.body.firstName,
                lastName: req.body.lastName || '',
                email: req.body.email.toLowerCase(),
                mobileNumber: req.body.mobileNumber,
                password: passwordLib.hashpassword(req.body.password),
                createdOn: time.now()
            })

            newUser.save((err,result) => {

                if(err){
                    console.log(err)
                    logger.error(err.message, 'userController: createUser', 10)
                    let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                    reject(apiResponse)
                }
                else{
                    let newUserObj = newUser.toObject();
                    resolve(newUserObj)
                }
            })
        }
        else{
            logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
            let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
            reject(apiResponse)
        }
    })

  })

 }


validateUserInput(req,res)
.then(createUser)
.then((resolve) => {
delete resolve.password;
apiResponse = response.generate(false,'user created succcessfully',200,resolve);
res.send(apiResponse);
})
.catch((err) => {
    console.log(err);
            res.send(err);
})



}
   
   let loginFunction = (req,res) => {

    let findUser = () => {

        return new Promise((resolve,reject) => {

         if(req.body.email){
             UserModel.findOne({email:req.body.email})
             .exec((err,result) => {
                if(err){
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(result)){
                    logger.error('No User Found', 'userController: findUser()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                }
                else{
                    logger.info('User Found', 'userController: findUser()', 10);
                    //Cookie.set('authtoken',apiResponse.data.authToken);
        //Cookie.set('receiverId',apiResponse.data.userDetails.userId);
        //Cookie.set('details',apiResponse.data.userDetails.firstName+''+apiResponse.data.userDetails.lastName);
         //this.service.setUserInfoLocalStorage(apiResponse.data.userDetails);

                    resolve(result);
                }

             })
         }
         else{
            let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
            reject(apiResponse)
         }

        })//end of the promise

    }//end of find user


    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve,reject) => {

        
           passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,result) => {
                if(err){
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }
                else if(result){
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                }
                else{
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
           })
        })
    }


    let generateToken = (userDetails) => {
        return new Promise((resolve,reject) => {
           token.generateToken(userDetails,(err,tokenDetails) => {
                 if(err){
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                 }
                 else{
                     tokenDetails.userId = userDetails.userId;
                     tokenDetails.userDetails = userDetails;
                     console.log("from token :-"+userDetails.firstName);
                     resolve(tokenDetails);
                 }
           })
        })

    }//end of the generate token



    let saveToken = (tokenDetails) => {

        return new Promise((resolve,reject) => {
        AuthModel.findOne({userId:tokenDetails.userId})
        .exec((err,retrievedTokenDetails) => {
               if(err){
                console.log(err.message, 'userController: saveToken', 10)
                let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                reject(apiResponse)
               }
               else if(check.isEmpty(retrievedTokenDetails)){

                let newAuthToken = new AuthModel({
                    userId: tokenDetails.userId,
                    authToken: tokenDetails.token,
                    tokenSecret: tokenDetails.tokenSecret,
                    tokenGenerationTime: time.now()
                })

                newAuthToken.save((err,newTokenDetails) => {
                   if(err){
                    console.log(err)
                    logger.error(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                   }
                   else{
                       let responseBody = {
                        authToken: newTokenDetails.authToken,
                        userDetails: tokenDetails.userDetails
                       }
                       resolve(responseBody);
                   }
                })

               }
               else{
                retrievedTokenDetails.authToken = tokenDetails.token
                retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                retrievedTokenDetails.tokenGenerationTime = time.now()
                retrievedTokenDetails.save((err, newTokenDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'userController: saveToken', 10)
                        let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                        reject(apiResponse)
                    } else {
                        let responseBody = {
                            authToken: newTokenDetails.authToken,
                            userDetails: tokenDetails.userDetails
                        }
                        resolve(responseBody)
                    }
                })

               }
        })


        })//end of promise

    }//end of the save token

findUser(req,res)
.then(validatePassword)
.then(generateToken)
.then(saveToken)
.then((resolve) => {
    let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
    res.status(200)
    res.send(apiResponse)
})
.catch((err) => {
    console.log("errorhandler");
    console.log(err);
    res.status(err.status)
    res.send(err)
})

}



   



let logout = (req, res) => {
    console.log("logout :---"+req.params.userId);
    AuthModel.findOneAndRemove({'userId': req.params.userId}, (err, result) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'user Controller: logout', 10)
          let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
          res.send(apiResponse)
      } else if (check.isEmpty(result)) {
          let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
          res.send(apiResponse)
      } else {
          let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
          //Cookie.set("userId","");
          res.send(apiResponse)
      }
    })
  } // end of the logout function.
  


module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    forgetPassword:forgetPassword,
    resetPass:resetPass,
    resetpassword111:resetpassword111,
    
    logout: logout

}// end exports