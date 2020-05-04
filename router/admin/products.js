const express = require('express');
// const productsRepo = require('../../repo/products');
const { validationResult } = require('express-validator');
const productNewTemplate = require('../../views/admin/products/new');
const { requireProductsTitle, requireProductsPrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
	res.send(productNewTemplate({}));
});

router.post(
	'/admin/products/new',
	[requireProductsTitle, requireProductsPrice],
	(req, res) => {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.send(productNewTemplate({ errors }));
		}
		res.send('Submitted!!!');
	},
);

module.exports = router;
