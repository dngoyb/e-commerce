const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = require('./router/admin/auth');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ['ngoy Banza'],
	}),
);

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
