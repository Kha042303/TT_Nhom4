import users from "../../models/user.model.js";

// GET /users
export const index = async (req, res) => {
  try {
    const Users = await users.findAll({
      raw: true
    });

    res.render("client/pages/user/index", {
      users: Users
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.send(err);
  }
};
