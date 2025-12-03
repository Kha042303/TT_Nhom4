module.exports = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; 
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền thực hiện"
      });
    }
    next();
  };
};
