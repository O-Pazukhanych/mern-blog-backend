import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {} from 'dotenv/config';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

console.log(process.env.PORT)

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

mongoose
	.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('DB connection success!'))
	.catch((error) => console.log(`DB connection error: ${error}`));

app.listen(process.env.PORT, (error) => {
	error ? console.log(error) : console.log(`Server listening port ${process.env.PORT}`);
});

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get('/tags', PostController.getLastTags);
app.get('/tags/:value', PostController.getTagPosts);