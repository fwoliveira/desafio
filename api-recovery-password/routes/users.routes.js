const usersRoutes = require('express').Router();
const users = require('../controllers/users.controller');
const { validarToken } = require('../middlewares/auth');


usersRoutes.get("/all", users.findAll);

usersRoutes.get("/show/:id", users.findOne);

usersRoutes.post("/create", users.create);

usersRoutes.put("/update", users.update);

usersRoutes.delete("/delete/:id", users.delete);

usersRoutes.post("/login", users.login);

usersRoutes.put("/password", users.password);

usersRoutes.post("/recovery", users.recovery);

usersRoutes.post("/alterpassword", users.alterpassword);

module.exports = usersRoutes;