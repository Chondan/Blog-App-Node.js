const express = require('express');
const router = express.Router();
const path = require('path');
const blogModel = require('../../models/blogModel');
const instance = new blogModel();

router.get('/', function(req, res) {
	blogModel.find({}, function(err, docs) {
		res.render('index', { blogs: docs });
	});
});

router.get('/:blogId', function(req, res) {
	const { blogId } = req.params;
	blogModel.findById(blogId, function(err, docs) {
		if(!err) {
			res.json(docs);
		}
	});
});

router.post('/', function(req, res) {
	const { title, content } = req.body;
	blogModel.create({ title: title, body: content, snippet: '' }, function(err, docs) {
		if(err) next(new Error("Error while adding new document"));
		res.end("done");
	});
});

router.delete('/:blogId', function(req, res) {
	const { blogId } = req.params;
	blogModel.deleteOne({ _id: blogId }, function(err, docs) {
		res.end("done");
	});
});

router.put('/:blogId', function(req, res) {
	const { blogId } = req.params;
	const { title, content } = req.body;
	blogModel.findByIdAndUpdate(blogId, { title: title, body: content }, { new:  true, runValidators:  true })
	.then(() => res.end("done"));
});

module.exports = router;