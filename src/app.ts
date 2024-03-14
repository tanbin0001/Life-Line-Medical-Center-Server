
import express, { Application, Request, Response } from "express";
import cors from 'cors'
import { userRoutes } from "./app/modules/User/user.routes";
 



const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "lifeline medical server"
    })
});


app.use('/api/v1/user', userRoutes)





export default app;