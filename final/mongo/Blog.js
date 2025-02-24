const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String,required: [true, 'Title is required.']},
    body: {type: String,required: [true, 'Body is required.']},
    author: {type: String,default: 'Anonymous'},
    createdAt: {type: Date,default: Date.now
    }
}, {
    timestamps: true 
});

blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
