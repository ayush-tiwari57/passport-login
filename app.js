const express = require("express");
const expresslayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = new express();

require('./config/passport')(passport);

mongoose.connect("mongodb://localhost/login_app",{useNewUrlParser: true})
    .then(()=> {
        console.log('Mogodb Connected..')
        app.listen(3000, console.log('listening on port 3000'));
    })
    .catch(err => console.log(err));

//ejs
app.use(expresslayout);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({extended: false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

