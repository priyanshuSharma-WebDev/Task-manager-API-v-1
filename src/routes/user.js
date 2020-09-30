const express = require("express");
const { UserModel, TaskModel } = require("../DB/models");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Authentication = require("../auth/auth")

// this is also the right way to hash password
// async function hashPassword(req,res,next) {

//     const hashedPassword = await bcrypt.hash(req.body.password,8);
//     req.body.password = hashedPassword;
//     next();
// }

router.post("/", async (req, res) => {
    const user = new UserModel(req.body);
    try {

        const User = await user.save();
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
        req.user.tokens = req.user.tokens.filter((token) => {
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
        console.log(User)
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


router.patch("/updateMe",Authentication, async (req, res) => {
    const objectKeys = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isallowed = objectKeys.every(update => allowedUpdates.includes(update));
    if (!isallowed) {
        return res.status(404).json({
            "error": "Invalid property!"
        })
    }
    try {

        // that is also a way to update files
        // const user = await UserModel.findById(req.user._id);
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

        // new
        await req.user.remove();
        await TaskModel.deleteMany({ owner: req.user._id });
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;