const { array, types } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}, toObject: { virtuals: true }}
const passportLocalMongoose = require('passport-local-mongoose');


const PhotoSchema = new Schema({
    url: String,
    filename: String
});

PhotoSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_40');
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: PhotoSchema,
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