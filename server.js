const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./router/admin/auth');
const adminProductsRouter = require('./router/admin/products');
const productsRouter = require('./router/products');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ['ngoy Banza'],
	}),
);

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
