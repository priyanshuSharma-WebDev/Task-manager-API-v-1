require("dotenv").config();
const express = require("express");
const { UserModel, TaskModel } = require("../DB/models");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Authentication = require("../auth/auth");
// const uploadFiles = require("./userFileUpload")


// this is also the right way to hash password
// async function hashPassword(req,res,next) {

//     const hashedPassword = await bcrypt.hash(req.body.password,8);
//     req.body.password = hashedPassword;
//     next();
// }




router.post("/register", async (req, res) => {
    const user = new UserModel(req.body);
    // console.log(user)
    try {
        // console.log("Wait into all set block")
        const User = await user.save();
        // console.log("Save documnet: ",User)
        // generate JWT of register request
        const jwtUser = await User.generateJsonWebToken();
        res.status(201).json({
            User,
            jwtUser
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
})


router.post("/login", async (req, res) => {
    try {
        // .findByCardentials is a custom method that I will attach with mongoose schema and use it like other mongoose method like : findById or find
        const getUser = await UserModel.findByCradentials(req.body.email, req.body.password);
        // generation json web toke for user who try to login
        const jwtUser = await getUser.generateJsonWebToken();
        res.send({ getUser, jwtUser })
    }
    catch (e) {
        res.status(404).send(e);
    }
})


router.get("/me", Authentication, async (req, res) => {

    // In this route I don't want to send user all data insted of send whole database I will send only user profile who authenticated with validation function
    res.send(req.user);
})

router.post("/logout", Authentication, async (req, res) => {
    try {

        // iterate tokens array to remove a particular token within that array
        req.user.tokens = req.user.tokens.filter((token) => {

            // if valid token found so that condition is true so that mean token is removed
            return token.token !== req.token
        })
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.send(500).send(e);
    }
})


router.post("/logoutAll", Authentication, async (req, res) => {
    try {

        // log out all user for devices mean -> (I will user here JWT authentication system so that user is allowed to create account with multiple devices upper logout route only logout user on particular device that user is currently used but this route is logout him all avaliable devices)
        req.user.tokens = []
        // console.log(req.user.tokens)
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.send(500).send(e);
    }
})


router.get("/:id", async (req, res) => {
    try {
        const User = await UserModel.findById(req.params.id)
        // console.log(User)
        if (!User) {
            return res.json({
                "error": "User not found!"
            })
        }
        res.json(User);
    }
    catch (e) {
        res.status(500).send(e)
    }
})


router.patch("/updateMe", Authentication, async (req, res) => {

    // get keys of req.body object that user send us
    const objectKeys = Object.keys(req.body);

    // all properties that are allowed to updates
    const allowedUpdates = ["name", "email", "password", "age"];

    // check user does not send unwanted property of the request
    const isallowed = objectKeys.every(update => allowedUpdates.includes(update));

    // if user add a property that is not mention in allowedUpdates array then we send back 404 message
    if (!isallowed) {
        return res.status(404).json({
            "error": "Invalid property!"
        })
    }
    try {

        // that is also a way to update document
        // const user = await UserModel.findById(req.user._id);

        // and that is forEach way
        objectKeys.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        z
        // const updateUser = await UserModel.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true});
        // if (!user) {
        //     return res.status(404).json({
        //         "error": "user not found to update"
        //     })
        // }

        res.send(user);

    }
    catch (e) {
        res.status(500).send(e);
    }
})

router.delete("/removeme", Authentication, async (req, res) => {
    try {

        // that is also a way to remove user (jab maine phele ye route banaya the tab ager user valid ho to bho id ki help se or bhi users ko delete kr sakta tha pr bho sirf khud ko hi delete kr sakta hai)

        // const deletedUser = await UserModel.findByIdAndDelete(req.user._id);

        // if (!deletedUser) {
        //     res.status(404).send({
        //         "error": "There is no user to delete!"
        //     })
        // }

        // new way to remove user in dbs
        await req.user.remove();

        // remove all tasks of that user when he/she is removed
        await TaskModel.deleteMany({ owner: req.user._id });
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;