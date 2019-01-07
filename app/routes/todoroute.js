const express = require('express');
const router = express.Router();
//const userController = require("./../../app/controllers/userController");
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/todolist`;


    app.get(`${baseUrl}/view/:userId`, todoController.getToDoList);


   /**
    * @apiGroup todolist
    * @apiVersion  1.0.0
    * @api {get} /api/v1/todolist/view/:userId api to get  the single users.
    *
    * 
    * 
    * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "getToDoList Found",
    "status": 200,
    "data": {
        "_id": "5c206a90f9fcea1500bc58c9",
        "todoList": [
            {
                "list": "hi these is to be done",
                "id": "gz3V8xs-5"
            }
        ],
        "isChecked": false,
        "email": "aniket.harode@gmail.com",
        "userId": "khQWNGD7o",
        "__v": 0
    }
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


  app.post(`${baseUrl}/createList`, todoController.createToDoList);

  /**
     * @api {post} /api/v1/todolist/createList api for creating the user.
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * 
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} userId userId of the user. (body params) (required)
     * @apiParam {string} isChecked isChecked of the user. (body params) (required)
     * @apiParam {string} todoList todoList is the to do list given by user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "create createToDoList",
    "status": 200,
    "data": {
        "__v": 0,
        "_id": "5c206a90f9fcea1500bc58c9",
        "todoList": [
            {
                "list": "hi these is to be done",
                
            }
        ],
        "isChecked": false,
        "email": "aniket.harode@gmail.com",
        "userId": "khQWNGD7o"
    }
}

@apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": true,
    "message": "Failed to create createToDoList",
    "status": 500,
    "data": null
}


	 

    */


   app.post(`${baseUrl}/addchildList`, todoController.addchildList);


   
   /**
    * @apiGroup todolist
    * @apiVersion  1.0.0
    * @api {get} /api/v1/todolist/addchildList api for adding the sub todo list of the users.
    *
    * @apiParam {string} childId id of the todo list . (body params) (required)
     * @apiParam {string} userId userId of the user. (body params) (required)
     * @apiParam {string} todoList todoList is the to do list given by user. (body params) (required)
    * 
    * @apiSuccessExample {object} Success-Response:
     {
    "n": 1,
    "nModified": 1,
    "ok": 1
}

   */




  app.post(`${baseUrl}/removechildList`, todoController.removechildList);


   
  /**
   * @apiGroup todolist
   * @apiVersion  1.0.0
   * @api {get} /api/v1/todolist/addchildList api for remove the sub todo list of the users.
   *
   * @apiParam {string} childId id of the todo list . (body params) (required)
    * @apiParam {string} userId userId of the user. (body params) (required)
    * @apiParam {string} todoList todoList is the to do list given by user. (body params) (required)
   * 
   * @apiSuccessExample {object} Success-Response:
    {
   "n": 1,
   "nModified": 1,
   "ok": 1
}

  */






  app.post(`${baseUrl}/deleteTodoList`, todoController.deleteUser);



  /**
     * @api {post} /api/v1/todolist/deleteTodoList api for deleting the user to do list.
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * 
     *
     * 
     * @apiParam {string} userId userId of the user. (body params) (required)
     *@apiParam {string} childId id of the todo list . (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Deleted the user successfully",
    "status": 200,
    "data": {
        "_id": "5c20e83d6ac424129c5a08de",
        "childId": "wGgwtRW0a",
        "__v": 0,
        "todoList": [
            {
                "list": "hi there"
            },
            {
                "list": "updted the child"
            }
        ],
        "isChecked": false,
        "email": "aniket.harode@gmail.com",
        "userId": "khQWNGD7o"
    }
}
@apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": true,
    "message": "Failed to delete ToDoList",
    "status": 500,
    "data": null
}


	 

    */




   app.post(`${baseUrl}/checkedTodoList`, todoController.checkedTodoList);



   /**
      * @api {post} /api/v1/todolist/checkedTodoList api for checked the to do list.
      * @apiGroup todolist
      * @apiVersion  1.0.0
      * 
      *
      * 
      * @apiParam {string} userId userId of the user. (body params) (required)
      *@apiParam {string} childId id of the todo list . (body params) (required)
      *
      * @apiSuccess {object} myResponse shows error status, message, http status code, result.
      * 
      * @apiSuccessExample {object} Success-Response:
          {
    "error": false,
    "message": "checkedTodoList successfully",
    "status": 200,
    "data": {
        "_id": "5c24b3ff87ecf212f0ce1b7b",
        "childId": "_fQy3R2nt",
        "__v": 0,
        "todoList": [
            {
                "list": "hi there"
            }
        ],
        "isChecked": true,
        "email": "aniket.harode@gmail.com",
        "userId": "khQWNGD7o"
    }
}
 @apiErrorExample {json} Error-Response:
      *
      * {
     "error": true,
     "message": "Failed to checked ToDoList",
     "status": 500,
     "data": null
 }
 
 
      
 
     */





}