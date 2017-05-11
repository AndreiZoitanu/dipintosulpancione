var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const fs = require("fs");
var Grid = require("gridfs-stream");
var db = mongoose.connection;

Grid.mongo = mongoose.mongo;
let gfs;

db.once("open", () => {
    gfs = Grid(db.db);


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


    router.get('/hello', (req, res) => {
      res.send('Hello Housem !');
    });
    router.get('/img/:imgname', (req, res) => {
        gfs.files.find({
            filename: req.params.imgname
        }).toArray((err, files) => {

            if (files.length === 0) {
                return res.status(400).send({
                    message: 'File not found'
                });
            }
            let data = [];
            let readstream = gfs.createReadStream({
                filename: files[0].filename
            });

            readstream.on('data', (chunk) => {
                data.push(chunk);
            });

            readstream.on('end', () => {
                data = Buffer.concat(data);
                let img = 'data:image/png;base64,' + Buffer(data).toString('base64');
                res.end(img);
            });

            readstream.on('error', (err) => {
                console.log('An error occurred!', err);
                throw err;
            });
        });
    });
    router.post('/img', (req, res) => {
        let part = req.files.file;
        let writeStream = gfs.createWriteStream({
            filename: 'img_' + part.name,
            mode: 'w',
            content_type: part.mimetype
        });

        writeStream.on('close', (file) => {
            return res.status(200).send({
                message: 'Success',
                file: file
            });
        });

        writeStream.write(part.data);

        writeStream.end();
    });
})


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
