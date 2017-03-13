var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Float = require('mongoose-float').loadType(mongoose);

// Product Schema
var ProductSchema = mongoose.Schema({
	date_created: {
    type: Date,
    default: Date.now,
    index:true
  },
	name: {
		type: String
	},
	price: {
		type: Float
	},
	quantity: {
		type: Number
	},
  category:{
    type: String
  },
  market:{
    type: String
  },
  img_link:{
    type: String
  }
});


var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.createProduct = function(newProduct, callback){
	newProduct.save(callback);
}
