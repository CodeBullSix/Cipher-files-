const rateLimit = require('express-rate-limit').default;
const limiter = rateLimit({ validate: { trustProxy: false, xForwardedForHeader: false } });
console.log("No crash with validate options.");
