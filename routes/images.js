var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'deduvaibr',
  api_key: '785991179584576',
  api_secret: 'fCr809fV4b7NL0hpx4QlDlEmlKA'
});

router.get('/pancione', function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/pancione' });

});

router.get('/trucco', function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/trucco' });

});

router.get('/feste', function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/feste' });

});

router.get('/quadri', function(req, res){

  cloudinary.api.resources(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
    { type: 'upload', prefix: 'dipintosulpancione/quadri' });

});

module.exports = router;
