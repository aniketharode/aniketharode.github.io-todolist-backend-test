const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');

const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')

const UserModel = mongoose.model('User');



/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User management Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User management Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

let friendRequest = (req,res) => {
    UserModel.update(
        { userId: req.body.userId},
        {
         
           
                $addToSet:{
              friendRequest: { "senderId": req.body.senderId,
                        "senderDetail":req.body.detail}
                }
            
          
        },
        (err,resu)=>{
            if(err){
                console.log("error in the friendRequest");
            }
            else{
                logger.info('friend reqest is send', 'User management Controller: friendRequest')
                let apiResponse = response.generate(false, 'friend reuqets is updated',200, resu)
                res.status(200).send(apiResponse);
            }
        }
     )

}



let acceptRequest = (req,res) => {
    UserModel.update(
        {"userId":req.body.recieverId},
        {$pull : {"friendRequest":{"senderId":req.body.senderUserId}}},
        (err,resu)=>{
            if(err){
                console.log("error in the acceptRequest");
            }
            else{
                logger.info('friend reqest is accepted', 'User management Controller: acceptRequest')
                console.log("userDetails :-"+req.body.recieverDetail);
                console.log("senderDetails :-"+req.body.senderDetail);
                let apiResponse = response.generate(false, 'successfully accepted the friend Request', 200, resu)
                friendList(req,res);
                //res.status(200).send(apiResponse);
            }
        }
        )

}

//update in the friend list of the recived  friend request

 friendList = (req,res) => {
    UserModel.update(
        { userId: req.body.recieverId},
        {
         
           
                $addToSet:{
              friendList: { "friendId": req.body.senderUserId,
                        "friendDetail":req.body.senderDetail}
                }
            
          
        },
        (err,resu)=>{
            if(err){
                console.log("error in the friendList");
            }
            else{
                logger.info('friend is added in reciever', 'User management Controller: friendList')
                let apiResponse = response.generate(false, 'friend reuqets is updated',200, resu)
               // res.status(200).send(apiResponse);
               friendListSender(req,res);
            }
        }
     )

}

//update in the sender friend request

 friendListSender = (req,res) => {
    UserModel.update(
        { userId: req.body.senderUserId},
        {
         
           
                $addToSet:{
              friendList: { "friendId": req.body.recieverId,
                        "friendDetail":req.body.recieverDetail}
                }
            
          
        },
        (err,resu)=>{
            if(err){
                console.log("error in the friendListSender");
            }
            else{
                logger.info('friend is added n sender', 'User management Controller: friendListSender')
                let apiResponse = response.generate(false, 'friend reuqets is updated',200, resu)
               res.status(200).send(apiResponse);
            }
        }
     )

}



let removeFriend = (req,res) => {
    UserModel.update(
        {"userId":req.body.userId},
        {$pull : {"friendList":{"friendId":req.body.senderId}}},
        (err,resu)=>{
            if(err){
                console.log("error in the acceptRequest");
            }
            else{
                logger.info('friend reqest is accepted', 'User management Controller: acceptRequest')
                console.log("userDetails :-"+req.body.userDetail);
                console.log("senderDetails :-"+req.body.detail);
                let apiResponse = response.generate(false, 'successfully accepted the friend Request', 200, resu)
                friendList(req,res);
                //res.status(200).send(apiResponse);
            }
        }
        )

}



module.exports = {
    getAllUser:getAllUser,
    friendRequest:friendRequest,
    acceptRequest:acceptRequest,
    //friendList:friendList,
    //friendListSender:friendListSender
    removeFriend:removeFriend
}