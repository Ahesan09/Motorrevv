import express from "express";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import { verifyAuthentication } from "./middleware/verify-auth-middleware.js";
import requestIp from 'request-ip'
import { carRoutes } from "./routes/cars.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- Middleware --------------------

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies and flash messages
app.use(cookieParser());
app.use(flash());

// Session management 
app.use(
    session({secret:"my-secret",resave:true,saveUninitialized:false})
);

// Get client IP
app.use(requestIp.mw());

// Authentication middleware
app.use(verifyAuthentication)

// Make user info available in templates or routes (optional)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// -------------------- Routes --------------------
app.use(carRoutes);      // prefix for car APIs
app.use(authRoutes);     // prefix for auth APIs

// -------------------- Error handling (optional) --------------------
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
