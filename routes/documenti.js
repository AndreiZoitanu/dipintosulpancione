var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs')
var s3 = require('s3');
var AWS = require('aws-sdk');
var open = require('open');

AWS.config.update({
    accessKeyId: "AKIAI756VY4RDEPZ75KQ",
    secretAccessKey: "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",
    signatureVersion: 'v4'
  });

// Create an S3 client
var awsS3Client = new AWS.S3();
var options = {
  s3Client: awsS3Client,
};
var client = s3.createClient(options);
var bucket = 'gestionecasa';

router.get('/bollette-pagate', ensureAuthenticated, function(req, res){
  awsS3Client.listObjects({Bucket: 'gestionecasa'}, function(err,data) {
    if (err)
      console.log(err);
    else{
      var files = [];
      var folder = '';
      data.Contents.forEach(function(element, index){
        if (index == 0){
          folder = element.Key;
        }else{
          if(element.Key.startsWith(folder)){
            files.push(element.Key);
          }
        }
      });

    res.render('documenti/bollette-pagate', files);
    }
  })
});

router.get('/bollette-da-pagare', ensureAuthenticated, function(req, res){
  awsS3Client.listObjects({Bucket: 'gestionecasa'}, function(err,data) {
    if (err)
      console.log(err);
    else{
      var files = [];
      var folder = '';
      data.Contents.forEach(function(element, index){
        if (index == 0){
          folder = element.Key;
        }else{
          if(element.Key.startsWith(folder)){
            files.push(element.Key.replace('/', '@'));
          }
        }
      });
    res.render('documenti/bollette-da-pagare', {'files': files});
    }
  })
});

router.get('/fotocopie', ensureAuthenticated, function(req, res){
  res.render('documenti/fotocopie');
});

router.get('/altro', ensureAuthenticated, function(req, res){
  res.render('documenti/altro');
});


router.get('/get_aws_file/:file', ensureAuthenticated, function(req, res){


  var x = awsS3Client.getSignedUrl('getObject',{Bucket: bucket, Key:req.params.file.replace('@', '/')})
  open( x, function (err) {
    if ( err ) throw err;
  });
  res.redirect('back');
});


router.post('/aws_upload', ensureAuthenticated, function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {

    var file_extension = files.file[0].originalFilename.split('.')[1];

    var params = {
     localFile: files.file[0].path,
     s3Params: {
       Bucket: bucket,
       Key: fields.folder + '/' + fields.name + '.' + file_extension
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
      res.redirect('back');
    });
  });
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
