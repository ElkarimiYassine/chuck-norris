const mongoose = require('mongoose');
const jokeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    joke: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
    
})

let Joke = mongoose.model('Joke',jokeSchema,'jokes');

module.exports = Joke;