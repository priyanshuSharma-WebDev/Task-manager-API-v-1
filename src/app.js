const express = require("express");
const { TaskModel, UserModel } = require("./DB/models");
const app = express();

// maintenance code
// app.use((req,res,next) => {
//     res.status(503).send("The site is currently in maintenance please try again later!");
// })


app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/users",require("./routes/user"));
app.use("/users/me",require("./routes/userFileUpload"))
app.use("/tasks",require("./routes/task"));


const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log("Server is running on port: "+PORT);
})
