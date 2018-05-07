'use strict';

const Schema = require('mongoose').Schema;

const Post = new Schema({
    title: {
        type: String,
        trim: true
    },
    content: String,
    createdAt: {
        type: Date,
        'default': Date.now
    }
});

module.exports = Post;
