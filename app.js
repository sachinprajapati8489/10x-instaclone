const express = require("express");
const path=require("path")
const app = express();
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
require("./models/Usermodel.js");
require("./models/post.js")


app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/post"))





// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     const PORT = process.env.PORT;
//     app.listen(PORT, () => {
//       console.log(`sun rha hu ${PORT} pe`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const mongo=process.env.MONGO_URI
mongoose.connect(mongo)
mongoose.connection.on("connected",()=>{
  console.log(`connected to db`);
})
mongoose.connection.on("error",()=>{
  console.log(`connected to db define error`);
})

app.use(express.static("build"))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"build","index.html"))
})
const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`sun rha hu ${PORT} pe`);
    });