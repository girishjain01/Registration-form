const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express ();
dotenv.config();

const port = process.env.PORT || 5000;

const username = process.env.MONGOODB_USERNAME;
const password = process.env.MONGOODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.dulqteg.mongodb.net/
registrationForm`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const registration = mongoose.model("Registration", registrationSchema);
app.user(bodyParser.urlencoded ({extended: true }));



app.get("/",(req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("register",async (req, res)=>{
    try{
        const {name, email, password} = req.body;

        const existingUser = await registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
        
    }catch (error){
        console.log(error);
        res.redirect("error");

    }
})

app.get("/success", (req, res)=>{
    res.sendFile (__dirname+"/pages/success.html") ;
})
app.get("/error",(req, res)=>{
    res.sendFile (__dirname+"/pages/error.html") ;
})


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})