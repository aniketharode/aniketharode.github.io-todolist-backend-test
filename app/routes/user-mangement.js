const express = require('express');
const router = express.Router();
//const userController = require("./../../app/controllers/userController");
const userManageController = require("./../../app/controllers/user-mangement-controller");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/usermanage`;


    

    app.get(`${baseUrl}/view/all`, userManageController.getAllUser);

 
    /**
     * @api {get} /api/v1/usermanage/view/all api for getting all users.
     * @apiVersion  1.0.0
     * @apiGroup users
     *
     *
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All User Details Found",
            "status": 200,
            "data": [
         {
            "createdOn": "2018-11-03T08:25:48.000Z",
            "mobileNumber": 915757878,
            "email": "aniket.harode@gmail.com",
            "password": "$2a$10$XIaqIorlQFeuvmgAH4qrEuVPrqFp5Ub8n910g6CilHsNVnS74.btO",
            "lastName": "Harode",
            "firstName": "Aniket",
            "userId": "s-oxtXcsf"
        }
    ]

        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": true,
    "message": "No User Found",
    "status": 404,
    "data": null
}
	 

    */


   app.post(`${baseUrl}/friendRequest`,userManageController.friendRequest);

     /**
    * @apiGroup todolist
    * @apiVersion  1.0.0
    * @api {get} /api/v1/usermanage/friendRequest api for sending the friend request.
    *
    * @apiParam {string} userId id of the user to whom friend request is send . (body params) (required)
     * @apiParam {string} senderId senderId of the user who sends the request. (body params) (required)
     * @apiParam {string} detail full name of the  user. (body params) (required)
    * 
    * @apiSuccessExample {object} Success-Response:
    {
    "error": false,
    "message": "friend reuqets is updated",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
@apiErrorExample {json} Error-Response:
	 *
	 * "data": {
        "n": 1,
        "nModified": 0,
        "ok": 1
    }
	 

    */

   app.post(`${baseUrl}/acceptRequest`,userManageController.acceptRequest);

    /**
    * @apiGroup todolist
    * @apiVersion  1.0.0
    * @api {get} /api/v1/usermanage/acceptRequest api for accepting the friend request.
    *
    * @apiParam {string} userId id of the user to whom friend request is send . (body params) (required)
     * @apiParam {string} senderId senderId of the user who sends the request. (body params) (required)
     * @apiParam {string} detail full name of the  sender user. (body params) (required)
     *  @apiParam {string} userDetail full name of the  user. (body params) (required)
    * 
    * @apiSuccessExample {object} Success-Response:
    {
    "error": false,
    "message": "friend reuqets is updated",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
@apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": false,
    "message": "friend reuquets is updated",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 0,
        "ok": 1
    }
}
	 

    */

}