// import rateLimit from 'express-rate-limit';

// // Define rate limiter settings
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 2, // Limit each IP to {} requests per windowMs
//     message: 'Too many requests, please try again later.'
// });

// export default limiter;


// filepath: c:\Users\Andrw\Evently\code\Evently\Evently\server\src\middlewares\rateLimiter.ts
import rateLimit from "express-rate-limit";

// Define rate limiter settings
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2, // Limit each IP to 2 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests, please try again later.",
});

export default limiter;