const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')




/* Models */
const todoModel = mongoose.model('todoSchema');


/* Get getToDoList details */
let getToDoList = (req, res) => {
    todoModel.find({ 'userId': req.params.userId })
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'to do Controller: getToDoList', 10)
                let apiResponse = response.generate(true, 'Failed To Find getToDoList', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No todo list Found', 'to do Controller: getToDoList')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'getToDoList Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end getToDoList user

let createToDoList = (req,res) => {
    todoModel.findOne({email:req.body.email})
.exec((err,result) => {
    let detail;
    let todolist;
    if(err){
        logger.error(err.message, 'todoController: createToDoList', 10)
        let apiResponse = response.generate(true, 'Failed To Create ToDoList', 500, null)
        res.send(apiResponse)
    }
    else {
       
         todolist = new todoModel({

            userId: req.body.userId,
            email: req.body.email.toLowerCase(),
            isChecked:req.body.isChecked,
            editedBy:req.body.editedBy,
            childId : shortid.generate(),
            todoList :[
                {
                 "list":req.body.todoList} 
                ]
            
        })

        todolist.save((err,result) => {

            if(err){
                console.log(err)
                logger.error(err.message, 'todoController: createToDoList', 10)
                let apiResponse = response.generate(true, 'Failed to create createToDoList', 500, null)
                res.send(apiResponse)
            }
            else{
                detail = result;
               let re = result.toObject();
                console.log(re.email);
                delete re._id
                delete re._v
                logger.info('todo list Found', 'to do Controller: createToDoList')
                let apiResponse = response.generate(false, 'create createToDoList', 200, re)
                res.send(apiResponse)
               // res.send(todolist)
            }
        })
    }
   /* else{
        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
        result.todoList.forEach(element => {
            //if(req.body.todoList==element)
           // var myJSON = JSON.stringify(element.list); 
            if(element.list.toString()!=req.body.todoList){
            //element.list.push(req.body.todoList);

            result.todoList.list = req.body.todoList;
            result.todoList.id = shortid.generate();
            }

          console.log("element list"+result.todoList.list+" id is "+result.todoList.id);
          // result.todoList.list = element.list;
         
          

        });

        console.log(result.todoList.list);
     //   let apiResponse = response.generate(true, 'getToDoList not found Found', 403, result)
        // res.status(403).send(result)
        
        todoModel.update(
            { userId: req.body.userId},
            {
              $push: {
                todoList:{ 
                  $each: [{ "list": result.todoList.list,"id": result.todoList.id}]
                   
                }
              }
            },
            (err,resu)=>{
                if(err){
                    console.log("error in the update");
                }
                else{
                    console.log("result is success "+resu);
                    res.status(403).send(resu);
                }
            }
         )

//start of it
/*
 todoModel.findOne({ 'userId': req.body.userId },(err, re) => {
     if (err) {
         console.log(err)
         logger.error(err.message, 'to do Controller: getToDoList', 10)
         let apiResponse = response.generate(true, 'Failed To Find getToDoList', 500, null)
         res.send(apiResponse)
     } else if (check.isEmpty(result)) {
         logger.info('No todo list Found', 'to do Controller: getToDoList')
         let apiResponse = response.generate(true, 'No User Found', 404, null)
         res.send(apiResponse)
     } else {
       re.todoList.list = result.todoList.list;
         console.log("from fnd one"+re.todoList.list);

         re.save((err, result) => {
            if(err){
                logger.error('error occured ','editCartProduct',10);
            }
            else{
                logger.info('product find the carts as well','editCarts',10);

               

            }
            
            })


         let apiResponse = response.generate(false, 'getToDoList Found', 200, re);
         res.send(apiResponse)
     }
 })
     */

        //end of it
        
    //}
})

}

let deleteUser = (req, res) => {

    todoModel.findOneAndRemove({ $and : [{"userId":req.body.userId},{"childId":req.body.childId}]}).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'todolist Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'todoList Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user



let checkedTodoList = (req, res) => {

    todoModel.findOne({ $and : [{"userId":req.body.userId},{"childId":req.body.childId}]}).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'todolist Controller: checkedTodoList', 10)
            let apiResponse = response.generate(true, 'Failed To checkedTodoList user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'todoList Controller: checkedTodoList')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
           // let apiResponse = response.generate(false, 'checkedTodoList successfully', 200, result)
            result.isChecked = req.body.check;
            result.editedBy = req.body.editedBy;
            console.log("result checked is"+result.isChecked);
            result.save((err,result) => {

                if(err){
                    logger.error(err.message, 'todolist Controller: checkedTodoList', 10)
                    let apiResponse = response.generate(true, 'Failed To save  checkedTodoList user', 404, null)
                    res.send(apiResponse);
                }
                else{
                    logger.info(' User Found', 'todoList Controller: checkedTodoList');
                    let apiResponse = response.generate(false, 'checkedTodoList successfully', 200, result);
                    res.send(apiResponse);
                }
            });
            
        }
    });// end user model find and remove


}// end delete user







let addchildList = (req,res) => {
    todoModel.findOne({$and : [{"userId":req.body.userId},{"childId":req.body.childId}]})
.exec((err,result) => {
    let detail;
    let todolist;
    if(err){
        logger.error(err.message, 'todoController: addchildList', 10)
        let apiResponse = response.generate(true, 'Failed To Create ToDoList', 500, null)
        res.send(apiResponse)
    }
    
    else{
        //logger.error('User Cannot Be Created.User Already Present', 'userController: addchildList', 4)
        //let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
       
       try{
        result.todoList.forEach(element => {
            //if(req.body.todoList==element)
           // var myJSON = JSON.stringify(element.list); 
            if(element.list.toString()!=req.body.todoList){
            //element.list.push(req.body.todoList);

            result.todoList.list = req.body.todoList;
            result.todoList.editedBy=req.body.editedBy;
            //result.todoList.id = shortid.generate();
            }

          console.log("element list"+result.todoList.list+" id is "+result.todoList.id);
          // result.todoList.list = element.list;
         
          

        });

        console.log(result.todoList.list);
     //   let apiResponse = response.generate(true, 'getToDoList not found Found', 403, result)
        // res.status(403).send(result)
        
        todoModel.update(
            { childId: req.body.childId},
            {
              $push: {
                todoList:{ 
                  $each: [{ "list": result.todoList.list,"editedBy": result.todoList.editedBy}]
                   
                }
              }
            },
            (err,resu)=>{
                if(err){
                    console.log("error in the update");
                    let apiResponse = response.generate(true, 'get sub ToDoList',304, resu);
                    res.status(304).send(apiResponse);
                }
                else{
                    console.log("result is success "+resu);
                    let apiResponse = response.generate(false, 'get sub ToDoList',200, resu)
                    res.status(200).send(apiResponse);
                }
            }
         )

        }
         catch(err){
                console.log(err.message);
        }
    }

    
})

}





let removechildList = (req,res) => {
    todoModel.findOne({$and : [{"userId":req.body.userId},{"childId":req.body.childId}]})
.exec((err,result) => {
    let detail;
    let todolist;
    if(err){
        logger.error(err.message, 'todoController: removechildList', 10)
        let apiResponse = response.generate(true, 'Failed To removechildList ToDoList', 500, null)
        res.send(apiResponse)
    }
    
    else{
        console.log("---------inside the remove child list"+req.body.childId);
       // logger.info('User Cannot Be Created.User Already Present', 'userController: removechildList', 4)
        //let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
        result.todoList.forEach((element,index) => {
            //if(req.body.todoList==element)
           // var myJSON = JSON.stringify(element.list); 

          
            if(element.list.toString()==req.body.todoList){
            //element.list.push(req.body.todoList);
            console.log("before match"+element.list[0]+"body list is"+req.body.todoList,"index "+index);
            
            todoModel.update(
                {"childId":req.body.childId},
                {$pull : {"todoList":{"list":req.body.todoList}}},
                (err,resu)=>{
                    if(err){
                        console.log("error in the update");
                    }
                    else{
                        console.log("result is success "+resu);
                        let apiResponse = response.generate(false, 'successfully deleted the sub child', 200, resu)
                        res.status(200).send(apiResponse);
                    }
                }
                )

            }

        //  console.log("element list"+result.todoList.list+" id is "+result.todoList.id);
          // result.todoList.list = element.list;
         
          

        });

        console.log(result);

        
    }
})

}








module.exports = {

    getToDoList:getToDoList,
createToDoList:createToDoList,
addchildList:addchildList,
deleteUser:deleteUser,
checkedTodoList:checkedTodoList,
removechildList:removechildList

}