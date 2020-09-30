const JWT = require("jsonwebtoken");
const {UserModel,TaskModel} = require("../DB/models")

const  Authentication = async function (req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        // console.log("Token: ",token)
        const decoded = JWT.verify(token, "Thisismylittlesecret");
        // console.log("Docoded Token: ",decoded)
        const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token': token });
        // console.log("User: ",user);
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).send({
            "error": "please authenticate."
        })
    }
}

module.exports = Authentication;