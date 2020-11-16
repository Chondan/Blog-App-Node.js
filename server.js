const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blog/blogRoute');

// MIDDLEWARE
app.use(express.urlencoded({ extend: true }));

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(result => {
	console.log("Connected to mongodb");
	app.listen(3000, () => console.log("Server started: Listening at port 3000"));
})
.catch(err => console.error(err));

// VIEWS ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// STATIC FILE
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.end(`<a href='/blog'>Blogs</a>`);
});

// BLOG CONTROLLERS
app.use('/blog', blogRouter);

app.get('/error', function(req, res, next) {
	const err = new Error("Test Error");
	err.status = 500;
	err.message = "Test Error";
	next(err);
});

// 404 PAGE NOT FOUND HANDLER
app.use(function(req, res) {
	res.status(404);
	res.end("404 Page Not Found");
});

// ERROR HANDLER
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.end(err.message);
});