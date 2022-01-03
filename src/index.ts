import express , {Response , Request} from "express"
const app = express()
const PORT = 3000 || process.env.PORT
import Router from "./Routes/router"


// middle ware
app.use(express.json())
app.use("/convert" , Router)
// 

app.get("/" , (req:Request , res:Response) =>{
    res.send('11')
})


app.listen(PORT)