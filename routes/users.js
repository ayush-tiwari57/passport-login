const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const passport = require('passport');
const router = express.Router();

//login
router.get('/login',(req,res) => res.render('login'));

//Register
//get request
router.get('/register',(req,res) => res.render('register'));

//post request
router.post('/register',(req,res) =>{
    console.log(req.body);
    const { name,email,password,password2} = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill all fields'});
    } 
    if(password!=password2){
        errors.push({msg: 'Passwords do not match'});
    }
    if(password.length<6){
        errors.push({msg: 'Password must consist of atleast 6 characters'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
          User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({msg: 'Already registered with this Email'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else{
                    const newuser = new User({
                        name: name,
                        email: email,
                        password: password
                    });

                    //encrypting password
                    bcrypt.genSalt(10,(err,salt) => 
                        bcrypt.hash(newuser.password,salt,(err,hash) =>{
                            if(err) throw err;

                            // encrypt password
                            newuser.password = hash;

                            // saving the user to db
                            newuser.save()
                                .then(user =>{
                                    req.flash('success_msg', 'You are successfully registered');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
    
});

//login post request
router.post('/login',(req,res,next) =>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);   
});

//logout
router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','Logged out successfully');
    res.redirect('/users/login');
});

module.exports = router;
