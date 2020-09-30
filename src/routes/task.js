const express = require("express");
const {UserModel,TaskModel} = require("../DB/models");
const router = new express.Router();
const Authentication = require("../auth/auth")



router.post("/",Authentication, async (req,res) => {

    // this solution is also correct
    // const task = new TaskModel(req.body);
    // task.owner = req.user._id;

    const task = new TaskModel({
        ...req.body,
        owner: req.user._id
    })

    try {
        const Task = await task.save();
        res.status(201).json(Task)
    }
    catch(e) {
        res.status(400).send(e)
    }
})


router.get("/",Authentication, async (req,res) => {

    try {
        // fine approch
        // const task = await TaskModel.find({"owner": req.user._id});

        await req.user.populate("tasks").execPopulate()
        res.json(req.user.tasks)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.get("/:id",Authentication, async (req,res) => {
    const _id = req.params.id;
    try {
        const task = await TaskModel.findOne({_id, owner: req.user._id})
        if(task === null) {
            res.status(404);
        }

        res.send(task);
    }
    catch(e) {
        res.status(500).send(e)
    }
})



router.patch("/:id",Authentication,async (req,res) => {
    const _id = req.params.id;
    const keys = Object.keys(req.body);
    const allowedUpdates = ["name","description","completed"];
    const isallowed = keys.every(key => allowedUpdates.includes(key));

    if(!isallowed) {
        return res.status(404).json({
            "error": "Invalid property!"
        })
    }

    try {
        // const updateTask = await TaskModel.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
        const task = await TaskModel.findOne({_id,"owner": req.user._id})

        if(!task) {
           return  res.status(404).json({
                "error": "Task is not found to update"
            })
        }

        keys.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.send(task)
    }
    catch (e) {
        res.status(500).send(e);
    }
})




router.delete("/:id",Authentication,async (req,res) => {
    const _id = req.params.id;
    try {
        const task = await TaskModel.findOneAndDelete({_id, owner: req.user._id})

        if(!task) {
            res.status(404).send({
                "error": "There is no task to delete!"
            })
        }


        res.send(task)
    }
    catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;
