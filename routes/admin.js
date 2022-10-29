const { Router } = require('express');
var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

//SESSION MIDDLEWARE
const adminLogin=(req,res,next)=>{
  if(req.session.login){
    next()
  }else{
    res.redirect('/admin/adminlogin')
  }

}
/* GET users listing. */
router.get('/', function(req, res, next) {

  if(req.session.login){
    productHelpers.getAllProdects().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{products, admin:true});
  })
}else{
  res.redirect('/admin/adminlogin')

}
  
 
});

router.get('/add-product',function(req,res){
  if(req.session.login){
  res.render('admin/add-product',{admin:true})
}else{
  res.redirect('/admin/adminlogin')

}
})
router.post('/add-product',function(req,res){
  

  
  productHelpers.addProduct(req.body,(result)=>{
    if(req.files){
      let image=req.files.image
    image.mv('./public/product-images/'+result+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product",{admin:true})

      }
    })
    }
    res.redirect('/admin')
  })
})

router.get('/adminlogin',(req,res)=>{

  if(req.session.login){
    res.redirect('/admin')
  }else{
    res.render('admin/adminlogin',{admin:true})
  }
  
})


const emaildb="admin@gmail.com"
const passworddb='112233'



router.post('/adminlogin',(req,res)=>{
  const {email,password}=req.body;

if (emaildb === email && passworddb===password){
  req.session.login=true;
  return res.redirect('/admin')
}else{
  req.session.loginError = true
  return res.redirect('/admin/adminlogin')
}
  
})

router.get('/delete-product/:id',adminLogin,(req,res)=>{
let proId = req.params.id
console.log(proId);
productHelpers.deleteProduct(proId).then((response)=>{
  res.redirect('/admin/')
})
})

router.get('/edit-product/:id',adminLogin,async(req,res)=>{
  console.log(req.params.id);
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product,admin:true})
})

router.post('/edit-product/:id',adminLogin,(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
if(req.files !== null){
  if(req.files.image){
    let Image=req.files.image
    Image.mv('./public/product-images/'+id+'.jpg')
  }
}

  })
})

router.get('/user-details',adminLogin,(req,res)=>{
  productHelpers.getUser().then((usersData)=>{
    res.render('admin/user-details',{usersData,admin:true})
  })
})

router.get('/delete-user/:id',(req,res)=>{
let userId=req.params.id
productHelpers.deleteUser(userId).then((response)=>{
res.redirect('/admin/user-details')
})

})


router.get('/update-user/:id',async(req,res)=>{
  let id=req.params.id
  const userData=await productHelpers.userDetails(id)
 
  res.render('admin/update-user',{userData,admin:true})
})

router.post('/update/:id',(req,res)=>{
  const Id=req.params.id
  console.log(Id);
  console.log(req.body)
  productHelpers.updateUser(Id,req.body).then((response)=>{
    res.redirect('/admin/user-details')
  })
})

router.get('all-products',adminLogin,(req,res)=>{
  res.redirect('/')
})

router.get('/admlogout',(req,res)=>{
  req.session.login=null
  res.redirect('/admin/adminlogin')
})
module.exports = router;
