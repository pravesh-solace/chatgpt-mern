const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000
const cors = require("cors");
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors("*"))
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
app.post("/create-image", async(req, res)=>{
    console.log("body", req.body);
    const {prompt,size,  n} = req.body.payload;
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512': '1024x1024';
    const imageURls = [];
    
    try {
        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
        prompt,
        n,
        size: imageSize,
    });
    
    
    response.data.data.map(url=>{
        return imageURls.push(url);
    })
    res.send({imageURls: imageURls})
    } catch (error) {
        if (error.response) {
            console.log("err1",error.response.status);
            console.log("err2",error.response.data);
          } else {
            console.log("err3",error.message);
          }
    }
    
})



 

app.get("/", (req, res)=>{
    //res.sendFile(path.join(__dirname+'/index.html'));
    res.send("hello")
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
})