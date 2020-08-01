const express = require('express');
const {getAccessToRoute, getAccessAdmin} = require('../middlewares/authorization/auth');
const { blockUser } = require('../controllers/admin');
const {checkUserExist} = require('../middlewares/database/databaseErrorHelpers');

//Block User

//Delete User
const router = express.Router();
//bütün routerlarda çalışacakları için middlewarelere aşağıdaki şekilde tanımladık
router.use([getAccessToRoute, getAccessAdmin]); 

router.get("/block/:id",checkUserExist, blockUser);

module.exports = router;