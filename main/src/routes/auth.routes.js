const { verifySignUp, verifyLogin } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const jwt = require("jsonwebtoken");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token",
      "Origin",
      "Content-Type",
      "Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post(
    "/api/auth/login",
    [verifyLogin.checkLoginDetails],
    controller.signin
  );

  app.post("/auth/users/reset_password", controller.requestPasswordReset);

  app.post("/auth/users/reset_password_confirm", controller.resetPassword);

  app.get("/api/auth/verify", (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      res.status(200).send({
        message: "Authenticated",
      });
    });
  });
};
