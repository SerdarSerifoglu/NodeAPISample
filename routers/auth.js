const express = require('express');
const {register, login, errorTest, tokenTest, getUser, logout, imageUpload} = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/error", errorTest);
router.get('/tokentest',getAccessToRoute, tokenTest);
router.get('/profile', getAccessToRoute, getUser );
router.get('/logout', getAccessToRoute, logout);
router.post('/upload', [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload);


module.exports = router;
