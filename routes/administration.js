var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Product = require('../models/product');

router.get('/products', function(req, res){
	Product.find({}, function(err, products) {
    res.render('products',{products:products});
  });
});

// Create Product
router.post('/products', function(req, res){
	var name = req.body.name;
	var price = parseFloat(req.body.price);
	var quantity = req.body.quantity;
	var category = req.body.category;
	var market = req.body.market;
	var img_link = req.body.img_link;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('price', 'Price is required').notEmpty();
	req.checkBody('quantity', 'Quantity is required').notEmpty();
	req.checkBody('category', 'Category is required').notEmpty();
	req.checkBody('market', 'Market is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('products',{
			errors:errors
		});
	} else {
		var newProduct = new Product({
			name: name,
			price:price,
			quantity: quantity,
			category: category,
			market:market,
			img_link:img_link
		});

		Product.createProduct(newProduct, function(err, product){
			if(err) throw err;
			console.log(product);
		});

		req.flash('success_msg', 'Product succesfully created');

		res.redirect('/administration/products');
	}
});


module.exports = router;
