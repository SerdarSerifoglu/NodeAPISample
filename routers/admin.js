const express = require('express');
const {getAccessToRoute, getAccessAdmin} = require('../middlewares/authorization/auth');

//Block User

//Delete User
const router = express.Router();
//bütün routerlarda çalışacakları için middlewarelere aşağıdaki şekilde tanımladık
router.use([getAccessToRoute, getAccessAdmin]); 

router.get("/", (req,res,next) => {
    res.status(200)
    .json({
        success: true,
        message: "Admin Page"
    });
});

module.exports = router;