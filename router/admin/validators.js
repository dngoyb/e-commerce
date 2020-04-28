const { check } = require('express-validator');
const usersRepo = require('../../repo/users');

module.exports = {
	requireEamil: check('username')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be valid email')
		.custom(async (email) => {
			const existEmail = await usersRepo.getOneBy({ email });
			if (existEmail) {
				throw new Error('Email already exist');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters'),
	requireConfirmPassword: check('confirmPassword')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters')
		.custom((confirmPassword, { req }) => {
			if (confirmPassword !== req.body.password) {
				throw new Error('Password did not match');
			}
		}),
};
