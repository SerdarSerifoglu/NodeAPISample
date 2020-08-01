const express = require('express');
const { merge } = require('./admin');

//mergeParams: önceki router'daki parametrelerinde bu router'a geçirilmesini sağlar.
const router = express.Router({mergeParams: true});

router.get("/", (req,res,next) => {
    console.log(req.params);

    res.send("Answers Route");
})
module.exports = router;