/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const redisLib = require('./redisLib');


const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
//const ChatModel = mongoose.model('Chat');
const response = require('./responseLib')

let setServer = (server) => {

    let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('')

    myIo.on('connection',(socket) => {

        console.log("on connection--emitting verify user");

       socket.emit("verifyUser", "");

    //    socket.on("calender-event",(userId)=>{
    //     myIo.emit(userId,"Meeting is scheduled for you kindly refresh the browser");
    //    })

        // code to verify the user and make him online

        socket.on('set-user',(authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else{

                    console.log("user is verified..setting details");
                     let currentUser = user.data;
                //  // setting socket user id 
                      socket.userId = currentUser.userId
                     let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                   // socket.emit(currentUser.userId,"You are online")

                     let userObj = {'userId':currentUser.userId,'fullName':fullName}
                     allOnlineUsers.push(userObj)
                    //  console.log(allOnlineUsers)

                   //  socket.room = 'edChat'
                    //                 // joining chat-group room.
                      //    socket.join(socket.room)
                  //  socket.emit('online-user-list', allOnlineUsers);

                     let key = currentUser.userId
                     let value = fullName

                     redisLib.setANewOnlineUserInHash("online-users",key,value,(err,result)=>{

                        if(err){
                            console.log(err)
                        }
                        else{

                            redisLib.getAllUsersInAHash("online-users",(err,result)=>{

                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`${fullName} is online`);
                                    // setting room name
                                   // socket.emit('online-user', result);
                                    socket.room = 'edChat'
                                    // joining chat-group room.
                                    socket.join(socket.room)
                                    
                                    socket.to(socket.room).broadcast.emit('online-user-list', result);
                                    myIo.emit('online-user-list', result);


                                }
                            })
                        }
                    })//end of the redis lib


                }

            })//end of the verify token withot claim
          
        }) // end of listening set-user event
        

        socket.on('disconnect',() => {
             console.log("user is disconnected");
            console.log(socket.userId);

             var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
             allOnlineUsers.splice(removeIndex, 1)
            //  console.log(allOnlineUsers)

            if(socket.userId){
               redisLib.deleteUserFromHash('online-users',socket.userId);
               redisLib.getAllUsersInAHash('online-users', (err, result) => {
                if(err){
                    console.log("error in gerall users from hash");
                }
                else{
                    socket.leave(socket.room);
                  //  socket.emit('online-user-remove', result);
                    socket.to(socket.room).broadcast.emit('online-user-list', result);
                    myIo.emit('online-user-list', result);
                }

                
            })
            }
            
        })


        socket.on('typing', (fullName) => {
            
            socket.to(socket.room).broadcast.emit('typing',fullName);
    
        });

        socket.on("send-request",(data)=>{
            console.log("sending the friend request to: "+data.recieverId+"from "+data.senderDetails+"WITH ID "+data.senderId);

            // allOnlineUsers.forEach(element => {
            //     if(element.userId==data.userId){
            //         console.log("friend request from "+element.fullName);
            //         socket.to(socket.room).broadcast.emit(data,"recieved the friend request from"+element.fullName);
            //     }
            // });

            
            socket.to(socket.room).broadcast.emit(data.recieverId,{"senderDetail":"recieved the friend request from"+data.senderDetails,
                                                                      "senderId":data.senderId,
                                                                      "recieverId":null});

            
        })

        
        socket.on("send-accept-request",(data)=>{
            console.log("accept the friend request from : "+data.recieverId+"by "+data.senderDetail+"WITH ID "+data.senderId);

            // allOnlineUsers.forEach(element => {
            //     if(element.userId==data.userId){
            //         console.log("friend request from "+element.fullName);
            //         socket.to(socket.room).broadcast.emit(data,"recieved the friend request from"+element.fullName);
            //     }
            // });

            console.log("reciever details "+data.recieverDetail);
            socket.to(socket.room).broadcast.emit(data.senderId,{"senderDetail":data.senderDetail,
                                                                      "recieverId":data.recieverId,
                                                                      "recieverDetail":data.recieverDetail});

            
        })
    

    //   socket.on('chat-msg',(data) => {
    //         console.log("socket chat-msg called")
    //             console.log(data);
    //             data['chatId'] = shortid.generate()
    //             console.log(data);
    
    //             // event to save chat.
    //             setTimeout(function(){
    //                 eventEmitter.emit('save-chat', data);
    
    //             },2000);
    
    //             myIo.emit(data.receiverId,data);
    //     })

    })


    // eventEmitter.on('save-chat', (data) => {

    //     // let today = Date.now();
    
    //     let newChat = new ChatModel({
    
    //         chatId: data.chatId,
    //         senderName: data.senderName,
    //         senderId: data.senderId,
    //         receiverName: data.receiverName || '',
    //         receiverId: data.receiverId || '',
    //         message: data.message,
    //         chatRoom: data.chatRoom || '',
    //         createdOn: data.createdOn
    
    //     });
    
    //     newChat.save((err,result) => {
    //         if(err){
    //             console.log(`error occurred: ${err}`);
    //         }
    //         else if(result == undefined || result == null || result == ""){
    //             console.log("Chat Is Not Saved.");
    //         }
    //         else {
    //             console.log("Chat Saved.");
    //             console.log(result);
    //         }
    //     });
    
    // }); // end of saving chat.*/







}
   
module.exports = {
    setServer: setServer
}
