const mongoose = require('mongoose');
const ConnDB = "mongodb://127.0.0.1/jokes";

mongoose.set("strictQuery", false);
mongoose.connect(ConnDB, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Connected to MongoDB");
    }
});
