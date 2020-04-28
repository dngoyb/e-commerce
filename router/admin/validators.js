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
};
