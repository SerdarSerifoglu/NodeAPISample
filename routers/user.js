const express = require('express');
const {getSingleUser} = require('../controllers/user');
const {checkUserExist} = require('../middlewares/database/databaseErrorHelpers');
const router = express.Router();

router.get("/:id",checkUserExist, getSingleUser);

module.exports = router;