const express = require('express');
const app = express();
const database = require('./config/database');
const jokes = require('./routes/jokes.routes');
const UserRoute = require('./routes/user.routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportSetup = require('./config/passport');
const port = 3000;

//middleware
isAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}

//session
app.use(session({
    secret:'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

//flash
app.use(flash());

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//EJS
app.set('view engine', 'ejs');

//passport
app.use(passport.initialize());
app.use(passport.session());

//Static folders
app.use(express.static('public'));
app.use(express.static('node_modules'));

//user var
app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null;
    next()
})

//Jokes
app.use('/jokes',isAuth,jokes);
//Users
app.use('/user',UserRoute);

app.listen(port,()=>{
    console.log('server listening on port '+port);
});