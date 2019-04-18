var express = require('express');
var router = express.Router();
var Users = require('../models/users');

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
