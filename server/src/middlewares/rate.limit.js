

import ratelimit from 'express-rate-limit';

export const auth_api_limit = ratelimit({

    // this rate limiter reset on every 15 min 
    windowMs: 15 * 60 * 1000, 
    // only 100 request allows on each 15 min 
    max: 100,

    standardHeaders: true,
    legacyHeaders: true,

    // if the any one of above is wrong then this message will gone as response to the client 
    message: {
        success: false,
        message: 'Too many requests, Please try again later!'
    }
});