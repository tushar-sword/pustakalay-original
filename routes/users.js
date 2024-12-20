const mongoose= require('mongoose')
const Schema= mongoose.Schema;

const plm= require("passport-local-mongoose");

const UserSchema = new Schema({
    name :{
        type: String,
        required: true
    },
    password :{
        type: String,
        minlength: 6
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
    address :{
        type : String,
    },
    Phone_no :{
        type : Number,
        required: true,
        unique: true
    },
    createdAt :{
        type:Date,
        default: Date.now
    }
});
UserSchema.plugin(plm, {
    usernameField: 'email', // Specify the username field
});


module.exports = mongoose.model('User',UserSchema);