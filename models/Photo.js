const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    image:String,
    description:String,
    dateCreated: {
        type: Date,
        default: Date.now,
      },
})

const Photo = mongoose.model('Photo',PhotoSchema);

module.exports = Photo;