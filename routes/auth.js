const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });
const requireLogin=require("../middleware/requireLogin")


// {
//   router.get("/protected", requireLogin,(req, res) => {
//     res.send("hello");
//   });
// }

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please fill all fields" });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedpassword) => {
      User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "user already exist with this email" });
        }
        const user = new User({
          email,
          password:hashedpassword,
          name,
        });
        user
          .save()
          .then((user) => {
            res.status(200).json({ message: "saved successfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })

    .catch((error) => {
      console.log(error);
    });
});





router.post("/login",(req,res)=>{
const {email,password}=req.body
 
if(!email || !password){
    return res.status(422).json({error:"please enter email or password"});
}

User.findOne({email:email})
.then((savedUser)=>{
    if(!savedUser){
        return res.status(422).json({error:"please enter email or password"})
    }

     bcrypt.compare(password,savedUser.password)
     .then((doMatch)=>{
           if(doMatch){
            
          const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
          const {id,name,email}=savedUser
          res.json({token,user:{id,name,email}})


           }
            else{
            return res.status(422).json({error:"please enter valid email or password"})
           }
       })
       .catch((err)=>{
        console.log(err)
       })

})

})

module.exports = router;
