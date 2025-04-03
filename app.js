const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Authentication middleware
const authenticateKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized - Invalid or missing API key'
    });
  }
  
  const apiKey = authHeader.split(' ')[1];
  
  // Implement your validation logic here
  // For this example, we'll use a placeholder validation
  
  if (apiKey === 'test_key') {
    // Free tier rate limits
    req.tier = 'free';
  } else if (apiKey === 'premium_key') {
    // Premium tier rate limits
    req.tier = 'premium';
  } else {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized - Invalid API key'
    });
  }
  
  next();
};

// Rate limiters
const freeTierLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    status: 'error',
    code: 429,
    message: 'Too Many Requests - Rate limit exceeded'
  }
});

const premiumTierLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  message: {
    status: 'error',
    code: 429,
    message: 'Too Many Requests - Rate limit exceeded'
  }
});

// Rate limiting middleware
const rateLimitByTier = (req, res, next) => {
  if (req.tier === 'premium') {
    return premiumTierLimiter(req, res, next);
  }
  return freeTierLimiter(req, res, next);
};

// Helper function to calculate square area
const calculateSquareArea = (side, unit = 'unit') => {
  if (!side) {
    throw new Error("Missing required parameter: 'side'");
  }
  
  const sideNum = Number(side);
  
  if (isNaN(sideNum) || sideNum <= 0) {
    throw new Error("Invalid input: 'side' must be a positive number");
  }
  
  const area = sideNum * sideNum;
  const squareUnit = unit === 'unit' ? 'unit²' : `${unit}²`;
  
  return {
    area,
    side: sideNum,
    unit,
    squareUnit
  };
};

// Routes
app.post('/v1/calculate', authenticateKey, rateLimitByTier, (req, res) => {
  try {
    const { side, unit = 'unit' } = req.body;
    
    if (side === undefined) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: "Missing required parameter: 'side'"
      });
    }
    
    const result = calculateSquareArea(side, unit);
    
    return res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: error.message
    });
  }
});

app.post('/v1/batch-calculate', authenticateKey, rateLimitByTier, (req, res) => {
  try {
    const { squares } = req.body;
    
    if (!squares || !Array.isArray(squares) || squares.length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: "Request must include a non-empty 'squares' array"
      });
    }
    
    const results = squares.map(square => {
      try {
        return calculateSquareArea(square.side, square.unit || 'unit');
      } catch (error) {
        // For individual square errors, include error in the result
        return {
          error: error.message,
          input: square
        };
      }
    });
    
    return res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: error.message
    });
  }
});

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Server Error - Something went wrong on our end'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Square Area Calculator API running on port ${port}`);
});

module.exports = app; // For testing purposes