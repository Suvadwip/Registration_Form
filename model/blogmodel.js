const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isDeleted: {
        type: String,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
})

const blogModel= new mongoose.model("blogData",BlogSchema)
module.exports = blogModel