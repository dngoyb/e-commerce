const express = require('express');
const usersRepo = require('../../repo/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { check, validationResult } = require('express-validator');
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
	async (req, res) => {
		const errors = validationResult(req);
		const { email, password } = req.body;

		if (!errors.isEmpty()) {
			return res.send(signupTemplate({ req, errors }));
		}

		const user = await usersRepo.create({ email, password });
		req.session.userId = user.Id;
		res.send('Account created!!!');
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
	async (req, res) => {
		const errors = validationResult(req);
		const { email, password } = req.body;
		const user = await usersRepo.getOneBy({ email });

		if (!errors.isEmpty()) {
			return res.send(signinTemplate({ errors }));
		}
		req.session.userId = user.id;
		res.send(`You are signed in`);
	},
);

module.exports = router;
