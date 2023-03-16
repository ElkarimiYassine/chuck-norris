const express = require('express');
const Router = express.Router();
const Jokes = require('../models/jokes');
const { check, validationResult } = require('express-validator');
const { request } = require('express');

isAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}

// Show all jokes
Router.get('/',(req,res,next)=>{
    Jokes.find({},(err,jokes)=>{
        let chunk =[];
        let chunkSize = 3;
        for (let i = 0 ; i < jokes.length; i+=chunkSize){
            chunk.push(jokes.slice(i,chunkSize+i));
        }
        res.render('jokes/index',{
            chunk: chunk,
            message: req.flash('success'),
        });
    })
});

//Create a new joke
// Get
Router.get('/create',isAuth,(req,res,next)=>{
    res.render('jokes/create',{
        errors: req.flash('errors')
    });
})
// Post
Router.post('/create',[
    //validation
    check('title','Title is required').not().isEmpty(),
    check('joke','joke is required').not().isEmpty()
],(req,res,next)=>{
    //validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('errors',errors.array());
        res.redirect('/jokes/create');
    }else{
        let newJoke = new Jokes({
            title: req.body.title,
            joke: req.body.joke,
            user_id: req.user.id,
        });
        newJoke.save((err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('joke was saved successfully');
                req.flash('success','Joke was added successfully');
                res.redirect('/jokes');
            }
        })
    }
});

// Show Single jokes
Router.get('/:id',(req,res,next)=>{
    Jokes.findById({_id: req.params.id},(err,joke)=>{
        if(!err){
            res.render('jokes/show',{
                joke: joke
            });
        }else {
            console.log(err);
        }
    })
});

// update joke
//get
Router.get('/edit/:id',(req, res,next) => {
    Jokes.findById({_id: req.params.id}, (err, joke) => {
        if (err) {
            console.log(err);
        }else {
            res.render('jokes/edit', {
                joke: joke,
                errors: req.flash('errors'),
                message: req.flash('info')
            });
        }
    })
})

// update
Router.post('/update',[
    check('title','Title is required').not().isEmpty(),
    check('joke','joke is required').not().isEmpty()
], (req, res) => {
    const errors = validationResult(req);
    const newJoke = {
        title: req.body.title,
        joke: req.body.joke
    };
    const query = {_id: req.body.id}

    if (!errors.isEmpty()){
        req.flash('errors',errors.array());
        res.redirect('/jokes/edit/'+req.body.id);
    }else{
        Jokes.updateOne(query,newJoke,(err)=>{
            if (err) {
                console.log(err);
            }else{
                req.flash('info','Joke was updated successfully');
                res.redirect('/jokes/edit/'+req.body.id);
            }
        })
    }
    
})

//delete
Router.delete('/delete/:id', (req,res)=>{
    const query = {_id: req.params.id}
    Jokes.deleteOne(query,(err)=>{
        if (err) {
            res.status(500).json('Joke was not deleted');
        }else{
            res.status(200).json('Joke was deleted');
        }
    })

})

module.exports = Router;