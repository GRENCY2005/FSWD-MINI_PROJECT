const express = require('express');
const 
{
    loginController,
    registerController,
} = require('../controllers/userController');
//route obj
const router = express.Router();

//routers
//POST || LOGIN
router.post('/login',loginController);

//POST || REGISTER USER
router.post('/register',registerController);
module.exports=router;