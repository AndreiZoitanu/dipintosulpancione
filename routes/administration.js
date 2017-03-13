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


router.get('/photos', ensureAuthenticated, function(req, res){

  cloudinary.api.resources(function(result){
    console.log(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/pancione' });

	res.render('administration/photos', {title:"Gestione foto"});

});

router.get('/news', ensureAuthenticated, function(req, res){
	res.render('administration/news', {title:"Gestione news"})
});


router.post('/photos', ensureAuthenticated, function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    console.log(fields.folder[0]);

    cloudinary.uploader.upload(files.foto[0].path, function(error,result) {
       if(!error){
         console.log(result)
       }else{
         console.log(error)
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
