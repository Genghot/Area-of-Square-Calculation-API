# Square Area Calculator API

A RESTful API service for calculating the area of squares with tiered rate limiting capabilities.

## Features

- Calculate area of a single square
- Batch calculate areas of multiple squares
- Support for custom measurement units
- Tiered API access (Free and Premium)
- Rate limiting based on API key tier
- Authentication via API keys
- Comprehensive error handling

## API Endpoints

### Calculate Single Square Area

```
POST /v1/calculate
```

Request Body:
```json
{
  "side": 5,
  "unit": "cm"  // optional, defaults to "unit"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "area": 25,
    "side": 5,
    "unit": "cm",
    "squareUnit": "cm²"
  }
}
```

### Batch Calculate Square Areas

```
POST /v1/batch-calculate
```

Request Body:
```json
{
  "squares": [
    { "side": 5, "unit": "cm" },
    { "side": 10 },
    { "side": 2.5, "unit": "m" }
  ]
}
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "area": 25,
      "side": 5,
      "unit": "cm",
      "squareUnit": "cm²"
    },
    {
      "area": 100,
      "side": 10,
      "unit": "unit",
      "squareUnit": "unit²"
    },
    {
      "area": 6.25,
      "side": 2.5,
      "unit": "m",
      "squareUnit": "m²"
    }
  ]
}
```

## Authentication

All API requests require authentication using an API key provided in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

There are two tiers of API keys:
- Free tier (`test_key`) - limited to 100 requests per minute
- Premium tier (`premium_key`) - limited to 1000 requests per minute

## Rate Limiting

Rate limits are enforced based on the API key tier:
- Free tier: 100 requests per minute
- Premium tier: 1000 requests per minute

When rate limits are exceeded, the API will respond with a 429 status code.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

Or use Docker:

```bash
docker build -t square-area-calculator-api .
docker run -p 3000:3000 square-area-calculator-api
```

### Environment Variables

- `PORT` - The port on which the API server runs (default: 3000)

## Development

- Run in development mode with hot reload: `npm run dev`
- Run tests: `npm test`

## License

This project is licensed under the MIT License - see the LICENSE file for details.