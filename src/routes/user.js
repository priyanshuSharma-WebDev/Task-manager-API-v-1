const express = require("express");
const { UserModel, TaskModel } = require("../DB/models");
const router = new express.Router();
const bcrypt = require("bcryptjs");

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
        console.log("User object: ",getUser)

        // generation json web toke for user who try to login
        const jwtUser = await getUser.generateJsonWebToken();
        res.send({ getUser, jwtUser })
    }
    catch (e) {
        res.status(404).send(e);
    }
})



router.get("/", async (req, res) => {

    try {
        const Users = await UserModel.find({});
        res.json(Users)
    }
    catch (e) {
        res.status(500).send(e)
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


router.patch("/:id", async (req, res) => {
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
        const user = await UserModel.findById(req.params.id);
        objectKeys.forEach(update => user[update] = req.body[update]);
        await user.save();

        // const updateUser = await UserModel.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true});
        if (!updateUser) {
            return res.status(404).json({
                "error": "user not found to update"
            })
        }
        res.send(updateUser);

    }
    catch (e) {
        res.status(500).send(e);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            res.status(404).send({
                "error": "There is no user to delete!"
            })
        }
        res.send(deletedUser)
    }
    catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;