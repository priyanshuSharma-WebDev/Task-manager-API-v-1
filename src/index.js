const express = require("express");
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


// app.post("/users",(req,res)=> {
//     res.status(201).send({
//         ...req.body
//     })

// })


module.exports = app;