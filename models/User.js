const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"] // name alanı girilmediğinde verilecek mesajı tanımladık
    },
    email: {
        type: String,
        required: true,
        unique: [
            true, "Please try different email" // email alanı veritabanında varsa verilecek mesajı tanımladık
        ],
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, //internetten aldığımız hazır email regex'i
            "Please provide a valid email" // email alanı email formatına uymuyorsa varsa verilecek mesajı tanımladık
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user","admin"] 
    },
    password: {
        type: String,
        minlength: [6, "Please provide a password with min lenght 6"],
        required: [true, "Please provide a password"],
        select: false //Bu sayede user bilgisi çekildiği zaman password bilgisinin görünmemesi sağlanmış oldu.
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    }
     
});

//.pre kaydedilmeden hemen önce yapılacak işlemleri belirlemememize yarar (Pre Hooks)
UserSchema.pre("save", function(next){
    
    //bcryptjs sitesinden hazır aldık (functionları arrow functiona dönüştürdük)
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);
        
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);
