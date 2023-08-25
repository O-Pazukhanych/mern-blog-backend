import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();
		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Posts not found'
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel
			.findByIdAndUpdate(postId, {
				$inc: { viewsCount: 1 }
			}, {
				returnDocument: 'after',
			}).populate('user')
			.then((doc) => {
				if (!doc) {
					return res.status(404).json({
						message: 'Post not found'
					})
				}
				res.json(doc);
			})
			.catch((error) => {
				console.log(error);
				return res.status(404).json({
					message: 'Post not found'
				})
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Post not found'
		})
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(','),
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to create post'
		})
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel
			.findByIdAndDelete(postId)
			.then((doc) => {
				if (!doc) {
					return res.json({
						message: 'Post not found'
					})
				}
				res.json({
					success: true
				})
			})
			.catch((error) => {
				console.log(error);
				return res.status(404).json({
					message: 'Failed to delete post'
				})
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to delete post'
		})
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel
			.findByIdAndUpdate(postId, {
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags.split(','),
				user: req.userId
			})
			.then((doc) => {
				if (!doc) {
					return res.json({
						message: 'Post not found'
					})
				}
				res.json({
					success: true
				})
			})
			.catch((error) => {
				console.log(error);
				return res.status(404).json({
					message: 'Failed to update post'
				})
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to update post'
		})
	}
};

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

		res.json(tags);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Tags not found'
		})
	}
}

export const getTagPosts = async (req, res) => {
	try {
		const tag = req.params.value;
		const posts = await PostModel.find({tags: tag})
		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Posts not found'
		})
	}
};