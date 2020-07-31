const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"] // name alanı girilmediğinde verilecek mesajı tanımladık
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
});

//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        id: this._id,
        name: this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });
    return token;
};
UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {REST_PASSWORD_EXPIRE} = process.env;

    
    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(REST_PASSWORD_EXPIRE);
    return resetPasswordToken;
};


//.pre kaydedilmeden hemen önce yapılacak işlemleri belirlemememize yarar (Pre Hooks)
UserSchema.pre("save", function(next){
    //Parola değiştirilmemişse tekrardan hashleme işlemini çalıştırma
    if(!this.isModified("password")){ //isModified mongoose'un kendi fonksiyonu belirtilen alan değiştimi değişmedimi bize söylüyor
        next();
    }
    //bcryptjs sitesinden hazır aldık (functionları arrow functiona dönüştürdük)
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash
            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);
