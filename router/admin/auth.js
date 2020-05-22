const express = require('express');
const usersRepo = require('../../repo/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { handleErrors } = require('./middlewares');
const {
	requireEmail,
	requirePassword,
	requireConfirmPassword,
	requireExistingEmail,
	requireExistingPassword,
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[requireEmail, requirePassword, requireConfirmPassword],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		const user = await usersRepo.create({ email, password });
		req.session.userId = user.Id;
		res.redirect('/admin/products');
	},
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You have signed out');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	'/signin',
	[requireExistingEmail, requireExistingPassword],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;
		res.redirect('/admin/products');
	},
);

module.exports = router;
