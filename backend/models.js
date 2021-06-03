const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        firstname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 15
        },
        lastname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 25
        },
        contact: {
            type: Number,
            trim: true,
            maxlength: 10,
            minlength: 10
        },
        encry_password: {
            type: String,
            required: true
        },
        salt: {
            type: String
        }
    }
)

userSchema.virtual("password")
    .get(function () {
        return this._password;
    })
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.encryptPassword(password);
    })

userSchema.methods = {
    authenticate: function (pswd) {
        return this.encryptPassword(pswd) === this.encry_password;
    },

    encryptPassword: function (plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex');
        }
        catch (error) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);