const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
const userhelpe=require('../helpers/user-helpe')
const verifyLogin=(req,res,next)=>{
  if(req.res.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }

}
/* GET home page. */
router.get('/',function(req, res, next) {
let user=req.session.user

   productHelpers.getAllProdects().then((products)=>{
    console.log(products);
    console.log(user);
    res.render('user/view-products',{products,user});
  })
});
router.get('/login',function(req,res){
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  
    res.render('user/login',{"loginerror":req.session.loginErr})
    req.session.loginErr=false
  }

  

})

router.get('/signup',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  
    res.render('user/signup')
    
  }
})

router.post('/signup',async(req,res)=>{
  let user=req.session.user
  let products=await productHelpers.getAllProdects()
  userhelpe.doSignup(req.body).then((response)=>{
    req.session.loggedIn=true
    req.session.user=req.body
   
    res.render('user/view-products',{user:req.session.user,products})
  })

})

router.post('/login',(req,res)=>{
  userhelpe.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')

    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }
    
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart')
})


module.exports = router;
