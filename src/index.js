import app from "./app.js"

app.get("/",(req,res)=>{
    res.send("<h1>This is Task Master</h1>")
})

app.listen(process.env.PORT,()=>{
    console.log(`\nServer running at http://localhost:${process.env.PORT}\n`)   
})