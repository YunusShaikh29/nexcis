const multer = require("multer");
const { Post } = require("../models/postModel");
const io = require("../index");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { description } = req.body;
    const filePath = `/uploads/${req.file.filename}`;

    try {
      const newPost = new Post({
        description,
        image: filePath,
        likes: 0,
        comments: [],
      });
      await newPost.save();
      io.emit("newPost", newPost);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};


exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    post.likes += 1;
    await post.save();

    const io = req.app.get('io'); // Get `io` from the request object
    io.emit('like', post);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    const comment = {
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const io = req.app.get('io'); // Get `io` from the request object
    io.emit('comment', post);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};