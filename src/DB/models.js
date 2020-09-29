const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

mongoose.connect("mongodb://127.0.0.1:27017/taskDB",{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true},(err) => {
    if(err) {
        return console.log("There is some error to create connection!");
    }
    console.log("Connection created successfully...");
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


// attaching a custom method of the instense of user model {the "methods" method is use for instenses }
UserSchema.methods.generateJsonWebToken = async function() {
    const user = this;
    const token = JWT.sign({ _id: user._id.toString() },"Thisismylittlesecret");
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}

// attaching a custom method {the statics method is use for models}
UserSchema.statics.findByCradentials = async (email,password) => {
    const getUserByEmail = await UserModel.findOne({email});
    if(getUserByEmail) {
        const comparePassword = await bcrypt.compare(password,getUserByEmail.password);
        if(comparePassword) {
            return getUserByEmail;
        }
        else {
            throw new Error("Invalid password");
        }
    }
    else throw new Error("Invalid User");
}


UserSchema.pre("save",async function(next) {
    // here I use this binding and this is point to documnt who is gonna to save
    const user = this;
    // is modified check is user update or not (it will become true 2 times when a new user going to save or user update his password)
    if(user.isModified("password")) {
        const hashedPassword = await bcrypt.hash(user.password,8);
        user.password = hashedPassword;
    }
    next();
})


const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// creating models
const UserModel = mongoose.model("user",UserSchema);
const TaskModel = mongoose.model("task",TaskSchema);

module.exports = {UserModel,TaskModel};