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
app.use("/tasks",require("./routes/task"));


const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log("Server is running on port: "+PORT);
})


// practice JWT
// const JWT = require("jsonwebtoken");

// const funcJWT = function () {
//     // JWT sign method is retun a token to the user who's try to login 
//     const userToken = JWT.sign({ _id: "aslkfjaoiejr132o482usj9we8r" },"Thisismylittlesecret:D",{expiresIn: "7 days"});
//     console.log(userToken)

//     // JWT verify function verify the user is valid or not it will return payload that is json object when it's found match else it will throw an error
//     const varifiedUser = JWT.verify(userToken,"Thisismylittlesecret:D")
//     console.log("Varified user: ",varifiedUser)
// }

// funcJWT();



// const relationship = async function() {
//     // const task = await TaskModel.findById("5f740e64f3ee0319bce9e2d2");

//     // // create relationship between user and his task when we use that methods mongoose replace owner property with owner object
//     // await task.populate("owner").execPopulate();
//     // console.log(task.owner);

//     const  User = await UserModel.findById("5f740c9a130e62513021cd13");
//     await User.populate("tasks").execPopulate();
//     console.log(User.tasks)

// }

// relationship();



// that line is going to take owner Id in task obj and convert it from the id of the owner to being the entire profile of the owner. (Note: execPopulate is only fire populate function and populate owner object)
// await User.populate("owner").execPopulate();