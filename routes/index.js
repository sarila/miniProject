var express = require('express');
var router = express.Router();
var Users = require('../models/users');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
		user: 'ngakhusisarila@gmail.com',
		pass: 'password'
  }
}));

var mailOptions = {
  from: 'ngakhusisarila@gmail.com',
  to: 'sarila@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'Thnakyou for signing up.'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project' });
});

router.get('/login', function(req, res){
	res.render('login')
});

router.get('/signup', function(req, res){
 	res.render('signup')
});

router.post('/signup', function(req, res){
	console.log('req....', req.body);
	var user = new Users({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		phone: req.body.phone
	});
	let mailOptions = {
			from: 'ngakhusisarila@gmail.com',
		  to: req.body.email,
		  subject: 'Welcome to Recipe box',
		  text: `Hello ${req.body.username}, You have signed up.Thank You.`
		}
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		
	var promise = user.save()
	promise.then((user) => {
		console.log('user signed up with values', user);
		Users.findOne().exec(function(err, users){
			res.render('dashboard', {users})
		});
	});
});


router.post('/login', function(req, res){
	if(req.body.username && req.body.password) {
		Users.find({username: req.body.username, password: req.body.password}, function(err, user){
		console.log('user loged in....',user);
		res.redirect('/dashboard');
	})
	} else {
		console.log('reenter username and password');
	 }
});


// router.post('/login', function(req, res){
// 	if(req.body.username && req.body.password) {
// 		var id = req.body.username;
// 		Users.find({username: req.body.username, password: req.body.password}, function(err, user){
// 		console.log('user loged in....',user);
// 		res.redirect('dashboard/' + id);
// 	})
// 	} else {
// 		console.log('reenter username and password');
// 	 }
// });

// router.get('/dashboard/:id', function(req, res){
// 	Users.findById(req.params.id).then(console.log('user found'));
// 	res.render('dashboard', {users:req.params.username})
// });


router.get('/dashboard', function(req, res){
	Users.findOne().exec(function(err, users){
		res.render('dashboard', {users})
	})
});

module.exports = router;
