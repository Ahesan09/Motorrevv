import cookieParser from 'cookie-parser';
import express from 'express';
import flash from 'connect-flash'
import requestIp from 'request-ip'
import { carRoutes } from './routes/cars.routes.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
// app.use(
//     session({secret:"my-secret",resave:true,saveUninitialized:false})
// );
app.use(flash());
app.use(requestIp.mw());
app.use(carRoutes)
// app.use(verifyAuthentication)
app.use((req,res,next)=>{
    res.locals.user = req.user
    return next();
})
// app.use(authRoutes)
// app.use(shortenerRoutes);
// app.set("view engine","ejs");

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})