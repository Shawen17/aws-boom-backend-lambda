const { authJwt, mediaUpload } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multer = require("multer");
const form_data = multer();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/portfolio", [authJwt.verifyToken], controller.userBoard);

  app.get("/api/users", [authJwt.verifyToken], controller.allUserProfiles);

  app.post(
    "/api/users",
    [mediaUpload.upload.single("avatar")],
    controller.addUser
  );

  app.put(
    "/api/update/status/:id/:result",
    [authJwt.verifyToken],
    controller.update_status
  );

  app.get("/api/loan", [authJwt.verifyToken], controller.loan_history);

  app.post(
    "/api/advance-filter",
    [authJwt.verifyToken],
    controller.advanced_filter
  );

  app.post(
    "/api/new/loan",
    [authJwt.verifyToken, form_data.none()],
    controller.loan_apply
  );

  app.put(
    "/api/portfolio/update",
    [authJwt.verifyToken, mediaUpload.upload.single("avatar")],
    controller.update_portfolio
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
