// Kendi kullanıcağımız error class'ını yazıyoruz
class CustomError extends Error{
    constructor(message, status){
        super(message); //class'a gelen message bilgisini Error classına gönderiyoruz.
        this.status = status;
    }
}

module.exports = CustomError;