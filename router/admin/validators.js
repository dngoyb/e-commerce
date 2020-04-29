const { check } = require('express-validator');
const usersRepo = require('../../repo/users');

module.exports = {
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be valid email')
		.custom(async (email) => {
			const userExist = await usersRepo.getOneBy({ email });
			if (userExist) {
				throw new Error('Email exists, use a different one');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4 })
		.withMessage('Must be between 4 and 20 characters'),
	requireConfirmPassword: check('confirmPassword')
		.trim()
		.isLength({ min: 4 })
		.withMessage('Password not match')
		.custom(async (confirmPassword, { req }) => {
			if (confirmPassword !== req.body.confirmPassword) {
				throw new Error('Passwords must match');
			}
		}),
	requireExistingEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Invalid email')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			console.log(user);
			if (!user) {
				throw new Error('Email not found');
			}
		}),
	requireExistingPassword: check('password')
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });

			if (!user) {
				throw new Error('Invalid password');
			}
			const validPassword = await usersRepo.comparePasswords(
				user.password,
				password,
			);
			if (!validPassword) {
				throw new Error(`Password does not match`);
			}
		}),
};
