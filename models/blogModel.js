const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPost = new Schema({
	title: String,
	body: String
});

const BlogModel = mongoose.model('blogs', BlogPost);

module.exports = BlogModel;