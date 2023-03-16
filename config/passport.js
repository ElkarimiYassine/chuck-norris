const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

//signup
passport.use('local.signup', new LocalStrategy (
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true  
    },
    (req,username,password,done)=>{
        if(req.body.password != req.body.Confirmpassword){
            return done(null,false,req.flash('error','Passwords do not match'));
        }else{
            User.findOne({email: username},(err,user)=>{
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null,false,req.flash('error','Email already exists'));
                }
                if(!user){
                    const newUser = new User(); 
                    newUser.email = req.body.email;
                    newUser.password = newUser.hashPassword(req.body.password);
                    newUser.save((err,user)=>{
                        if(err){
                            console.log(err);
                        }else{
                            return done(null,user,req.flash('success','User saved successfully'))
                        }
                    })
                }
            })
        }
    }
));

//login
passport.use('local.login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
},(req,username,password,done)=>{
    User.findOne({email: username},(err,user)=>{
        if(err){
            return done(null,false,req.flash('error','try again'));
        }
        if(!user){
            return done(null,false,req.flash('error','User not found'));
        }
        if(user){
            if(user.comparePasswords(password,user.password)){
                return done(null,user,req.flash('success','Welcome to your profile'));
            }
            else {
                return done(null,false,req.flash('error','Invalid password'));
            }
        }
    })

}))