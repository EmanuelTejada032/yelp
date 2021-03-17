const { array, types } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}, toObject: { virtuals: true }}
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    userPlaces:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Campground'
        }
    ]
    
}, opts);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);