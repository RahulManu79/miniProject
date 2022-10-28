
const bcrypt=require('bcrypt')
var db=require('../config/conection')
var collection=require('../config/collections')
const { response } = require('express')

module.exports={
    doSignup:(userData)=>{

        return new Promise(async(resolve,reject)=>{
            const salt = await bcrypt.genSalt(10)
            userData.password=userData.password.toString()
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId.toString())
            })

        })


    },
    doLogin:(userData)=>{
        return new Promise (async(resolve,reject)=>{
           let loginStatus=false
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login succses");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("log in faild");
                        resolve({status:false})
                    }
                })

            }else{
                console.log("login faild");
                resolve({status:false})
            }
        })
    }
}