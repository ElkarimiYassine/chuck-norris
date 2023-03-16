const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const Jokes = require('../models/jokes');
const { check, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

//middleware
isAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}

//Login
router.get('/login',(req, res) =>{
    res.render('user/login',{
        error: req.flash('error')
    });
});

router.post('/login',
passport.authenticate('local.login',
                    {successRedirect: '/user/profile',
                    failureRedirect: '/user/login',
                    failureFalsh: true }));

//Signup
router.get('/signup',(req,res) =>{
    res.render('user/signup',{
        error: req.flash('error')
    });
});

router.post('/signup',
passport.authenticate('local.signup',
                    {successRedirect: '/user/profile',
                    failureRedirect: '/user/signup',
                    failureFalsh: true }));

 router.get('/profile',(req, res) =>{

    Jokes.findById({},(err,jokes)=>{
        let chunk =[];
        let chunkSize = 3;
        for (let i = 0 ; i < jokes.length; i+=chunkSize){
            chunk.push(jokes.slice(i,chunkSize+i));
        }
        res.render('user/profile',{
            chunk: chunk,
            message: req.flash('success'),
        });
    })
 });

 router.get('/logout',(req, res) =>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/user/login');
      });
});

module.exports = router;