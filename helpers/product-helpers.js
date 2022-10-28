var db=require('../config/conection')
var collection=require('../config/collections')
const { response } = require('../app')
var objectId=require('mongodb').ObjectID
module.exports={
    addProduct:async(product,callback)=>{
       
        let productExist=await db.get().collection('product').findOne({title:product.title})
        if(productExist){
            callback()
        }else{
            db.get().collection('product').insertOne(product).then((data) => {
           
                callback(data.insertedId.toString())
            })  
        }
       
     },

     getAllProdects:()=>{
        return new Promise(async (resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
     },
     deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)

            })
        })

     },
     getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })

        })
     },
     updateProduct:(proId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    title:productDetails.title,
                    Catogary:productDetails.Catogary,
                    Price:productDetails.Price,
                    Description:productDetails.Description,

                }
            }).then((response)=>{
                resolve()
            })
        })
     },

      //GETTING USERS DATA FROM DATABASE
     getUser:()=>{
        return new Promise(async(resolve,reject)=>{

            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)

        })

     },
     deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
                 
                resolve(true)
            })
        })
     },
     userDetails:(id)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)}).then((userDetails)=>{
               
                resolve(userDetails)
            })
        })

     },

     updateUser:(userId,editedData)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:
                {name:editedData.name,
                email:editedData.email
            }}).then((response)=>{
                resolve(response)

            })
        })
     }
}