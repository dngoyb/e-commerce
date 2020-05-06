const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repo/products');
const productNewTemplate = require('../../views/admin/products/new');
const { requireProductsTitle, requireProductsPrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
	res.send(productNewTemplate({}));
});

router.post(
	'/admin/products/new',
	upload.single('image'),
	[requireProductsTitle, requireProductsPrice],
	handleErrors(productNewTemplate),
	async (req, res) => {
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productsRepo.create({ title, price, image });
		res.send('Submitted!!!');
	},
);

module.exports = router;
