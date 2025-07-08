function checkLogin(req, res, next) {
  if (!req.session.username) {
    res.redirect('/log');
    return;
  };
  next();
};

module.exports = checkLogin;