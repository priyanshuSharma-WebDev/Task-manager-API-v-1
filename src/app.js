const express = require("express");
const app = express();


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