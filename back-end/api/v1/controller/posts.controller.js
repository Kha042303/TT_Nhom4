import post from "../../models/posts.model.js";

// GET /posts
export const index = async (req, res) => {
  try {
    const Posts = await post.findAll({
      raw: true
    });

    res.render("client/pages/posts/index", {
      posts: Posts
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.send(err);
  }
};
