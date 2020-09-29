const express = require("express");
const {UserModel,TaskModel} = require("../DB/models");
const router = new express.Router();


router.post("/", async (req,res) => {
    const task = new TaskModel(req.body);

    try {
        const Task = await task.save();
        res.status(201).json(Task)
    }
    catch(e) {
        res.status(400).send(e)
    }
})


router.get("/", async (req,res) => {

    try {
        const task = await TaskModel.find({});
        res.json(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
})


router.patch("/:id",async (req,res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ["description","completed"];
    const isallowed = keys.every(key => allowedUpdates.includes(key));

    if(!isallowed) {
        return res.status(404).json({
            "error": "Invalid property!"
        })
    }

    try {
        const updateTask = await TaskModel.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
        if(!updateTask) {
           return  res.status(404).json({
                "error": "Task is not found to update"
            })
        }
        res.send(updateTask)
    }
    catch (e) {
        res.status(500).send(e);
    }
})




router.delete("/:id",async (req,res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);

        if(!deletedTask) {
            res.status(404).send({
                "error": "There is no task to delete!"
            })
        }
        res.send(deletedTask)
    }
    catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;
