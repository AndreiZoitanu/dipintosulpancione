var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs')
var s3 = require('s3');
var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIAI5L3Q6XPQFC4L6BQ",
    secretAccessKey: "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",
    signatureVersion: 'v4'
  });

// Create an S3 client
var awsS3Client = new AWS.S3();
var options = {
  s3Client: awsS3Client,
};
var client = s3.createClient(options);


router.get('/bollette-pagate', ensureAuthenticated, function(req, res){
  awsS3Client.listObjects({Bucket: 'gestionecasa'}, function(err,data) {
    if (err)
      console.log(err);
    else{
      data.Contents.forEach(function(element){
        console.log(element.Key);
      });
    res.render('documenti/bollette-pagate');
    }
  })
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


function getFiles(bucket){
  awsS3Client.listObjects({Bucket: bucket}, function(err,data) {
    if (err)
      console.log(err);
    else{
      return data;
    }
  })
}


function uploadFile(localFile, bucket, key){

  var params = {
   localFile: localFile,
   s3Params: {
     Bucket: bucket,
     Key: key
   },
  };

  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
              uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
  });
}



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
