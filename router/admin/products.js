const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repo/products');
const productNewTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');
const { requireProductsTitle, requireProductsPrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();

    res.send(productIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productNewTemplate({}));
});

router.post(
    '/admin/products/new',
    requireAuth,
    upload.single('image'),
    [requireProductsTitle, requireProductsPrice],
    handleErrors(productNewTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;

        await productsRepo.create({ title, price, image });
        res.redirect('/admin/products');
    }
);

module.exports = router;
