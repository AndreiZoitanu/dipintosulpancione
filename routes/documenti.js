var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/bollette-pagate', ensureAuthenticated, function(req, res){
	res.render('documenti/bollette-pagate');
});

router.get('/bollette-da-pagare', ensureAuthenticated, function(req, res){
	res.render('documenti/bollette-da-pagare');
});

router.get('/fotocopie', ensureAuthenticated, function(req, res){
	res.render('documenti/fotocopie');
});

router.get('/altro', ensureAuthenticated, function(req, res){
	res.render('documenti/altro');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
