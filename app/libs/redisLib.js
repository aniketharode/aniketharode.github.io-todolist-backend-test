const redis = require('redis');
const check = require("./checkLib.js");

let client = redis.createClient({
    url:"redis://redis-10982.c62.us-east-1-4.ec2.cloud.redislabs.com:10982",
})

client.auth("YnFarW76PLahlGAYKvEw2Sph3UpkQ20n");


client.on('connect',() => {
    console.log("Redis connection successfully opened");
})

let getAllUsersInAHash = (hashname,callback) => {
client.HGETALL(hashname,(err,result) => {

    if(err){
        console.log(err);
        callback(err,null);
    }
    else if(check.isEmpty(result)){
        console.log("online user list is empty");
        console.log(result)
        callback(err,{});
    }
    else{
        console.log(result);
        callback(null,result);
    }
})
}

let setANewOnlineUserInHash = (hashname, key, value, callback) => {

client.HMSET(hashname,[key,value],(err,result) => {

    if (err) {
        console.log(err);
        callback(err, null)
    } else {

        console.log("user has been set in the hash map");
        console.log(result)
        callback(null, result)
    }
})
}

let deleteUserFromHash = (hashName,key)=>{

    client.HDEL(hashName,key);
    return true;

}// end delete user from hash

module.exports = {
    getAllUsersInAHash:getAllUsersInAHash,
    setANewOnlineUserInHash:setANewOnlineUserInHash,
    deleteUserFromHash:deleteUserFromHash
}