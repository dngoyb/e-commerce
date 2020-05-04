const repository = require('./repository');

class productsRepo extends repository {}

module.exports = new productsRepo('products.json');
