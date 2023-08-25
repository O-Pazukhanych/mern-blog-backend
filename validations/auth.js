import { body } from "express-validator";

export const registerValidation = [
	body('email', 'Incorrect mail format').isEmail(),
	body('password', 'The password must consist of at least 4 characters').isLength({ min: 4 }),
	body('fullName', 'Please enter a name').isLength({ min: 3 }),
	body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];

export const loginValidation = [
	body('email', 'Incorrect mail format').isEmail(),
	body('password', 'The password must consist of at least 4 characters').isLength({ min: 4 }),
];