var mongoose = require('mongoose');
var Schema = mongoose.Schema;

productsSchema = new Schema( {
	
	name: String,
	price: String,
	category: String
}),
Products = mongoose.model('Products', productsSchema);

module.exports = Products;