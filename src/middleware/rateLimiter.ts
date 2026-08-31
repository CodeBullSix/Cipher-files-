import rateLimit from 'express-rate-limit';

const validateOptions = { trustProxy: false, xForwardedForHeader: false };

// General API Limiter (1000 requests per 15 mins)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: validateOptions,
  message: { error: 'Too many requests, please try again later.' }
});

// Mutation Limiter for Posts/Puts/Deletes (150 requests per 15 mins)
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  validate: validateOptions,
  message: { error: 'You are making too many changes. Please wait a moment.' }
});

// High Risk Actions (Reports, Appeals)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: validateOptions,
  message: { error: 'Too many requests for this action. Please wait 15 minutes.' }
});
