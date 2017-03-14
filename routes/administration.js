var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');


cloudinary.config({
  cloud_name: 'deduvaibr',
  api_key: '785991179584576',
  api_secret: 'fCr809fV4b7NL0hpx4QlDlEmlKA'
});

router.get('/photos/pancione', ensureAuthenticated, function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/pancione' });

});

router.get('/photos/pancione', ensureAuthenticated, function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/pancione' });

});



router.get('/photos', ensureAuthenticated, function(req, res){

	res.render('administration/photos', {title:"Gestione foto"});

});

router.get('/news', ensureAuthenticated, function(req, res){
	res.render('administration/news', {title:"Gestione news"})
});


router.post('/photos', ensureAuthenticated, function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    cloudinary.uploader.upload(files.foto[0].path, function(error,result) {
       if(!error.error){
         res.render('administration/photos',{loadingFinish:true});
       }else{
         res.render('administration/photos',{
     			error:error.error.message
     		});
       }
    },
     { public_id: `dipintosulpancione/${fields.folder[0]}/${files.foto[0].originalFilename.replace('.jpg', '')}`}
   );
  });
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
