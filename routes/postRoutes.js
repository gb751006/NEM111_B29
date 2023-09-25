const express = require("express");
const { auth } = require("../middleware/auth");
const { PostModel } = require("../model/postModel");

const postRouter = express.Router();

postRouter.use(auth);

//Get POST

postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find({ userID: req.body.userID });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Add Posts

postRouter.post("/add", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).json({ message: "Post Created successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Edit Posts

postRouter.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, body, device } = req.body;

  try {
    const post = await PostModel.findOneAndUpdate(
      { _id: postId, user: req.user.id },
      { title, body, device },
      { new: true }
    );

    if (!post) {
      return res
        .status(200)
        .json({ message: "Post not found or unauthorized." });
    }
    res.json({ message: "Post updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

//Delete Post

postRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await PostModel.findOneAndRemove({
      _id: postId,
      user: req.user.id,
    });

    if (!post) {
      return res
        .status(200)
        .json({ message: "Post not found or unauthorized." });
    }
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  postRouter
};
