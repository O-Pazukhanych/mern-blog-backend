import { body } from "express-validator";

export const postCreateValidation = [
	body('title', 'Please enter a title').isLength({min: 3}).isString(),
	body('text', 'Please enter a text').isLength({min: 10}).isString(),
	body('tags', 'Tag format is incorrect').optional().isString(),
	body('imageUrl', 'Invalid image link').optional().isString(),
];