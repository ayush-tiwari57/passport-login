const localstategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//require user model
const User = require('../models/Users');

module.exports =function(passport){
    passport.use(
        new localstategy({usernameField:'email'},(email,password,done) =>{
            //match user
            User.findOne({email:email})
                .then(user =>{
                    if(!user){
                        return done(null,false,{message:'You need to registerd first!!'});
                    }

                    //match password
                    bcrypt.compare(password,user.password,(err,ismatch) =>{
                        if(ismatch){
                            return done(null,user);
                        }
                        else{
                            return done(null,false,{message: 'Passsword incorrect!'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
    });

}