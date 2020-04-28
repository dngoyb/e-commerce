const express = require('express');
const usersRepo = require('../../repo/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { check, validationResult } = require('express-validator');
const {
	requireEmail,
	requirePassword,
	requireConfirmPassword,
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

console.log(check('email').isEmail());
router.post(
	'/signup',
	[requirePassword, requireConfirmPassword],
	async (req, res) => {
		const errors = validationResult(req);
		const { email, password, confirmPassword } = req.body;

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
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
	res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send(`User doesn't exist`);
	}
	const validPassword = await usersRepo.comparePasswords(
		user.password,
		password,
	);
	if (!validPassword) {
		return res.send(`Invalid Password`);
	}
	req.session.userId = user.id;
	res.send(`You are signed in`);
});

module.exports = router;
