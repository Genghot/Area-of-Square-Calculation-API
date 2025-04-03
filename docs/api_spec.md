# Square Area Calculator API Specification

## Overview
This API provides a simple and efficient way to calculate the area of a square. It's designed for fast response times and straightforward integration into various applications.

## Base URL
```
https://api.squarecalculator.com/v1
```

## Endpoints

### Calculate Square Area
Calculates the area of a square based on the length of its side.

**Endpoint:** `/calculate`

**Method:** `POST`

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| side      | number | Yes | The length of one side of the square (must be positive) |
| unit      | string | No  | Unit of measurement (e.g., "cm", "m", "in"). Default: "unit" |

**Example Request:**
```json
{
  "side": 5.75,
  "unit": "cm"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "area": 33.0625,
    "side": 5.75,
    "unit": "cm",
    "squareUnit": "cm²"
  }
}
```

**Error Responses:**

1. Invalid input
```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid input: 'side' must be a positive number"
}
```

2. Missing required parameter
```json
{
  "status": "error",
  "code": 400,
  "message": "Missing required parameter: 'side'"
}
```

### Batch Calculate
Calculates areas for multiple squares in a single request.

**Endpoint:** `/batch-calculate`

**Method:** `POST`

**Request Parameters:**
```json
{
  "squares": [
    {"side": 5, "unit": "cm"},
    {"side": 10, "unit": "m"},
    {"side": 2.5, "unit": "in"}
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {"area": 25, "side": 5, "unit": "cm", "squareUnit": "cm²"},
    {"area": 100, "side": 10, "unit": "m", "squareUnit": "m²"},
    {"area": 6.25, "side": 2.5, "unit": "in", "squareUnit": "in²"}
  ]
}
```

## Rate Limiting
- 100 requests per minute for free tier users
- 1000 requests per minute for premium tier users

## Authentication
API keys are required for authentication and can be included in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input parameters |
| 401  | Unauthorized - Invalid or missing API key |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Server Error - Something went wrong on our end |

## SDK Support
- JavaScript
- Python
- Java
- Ruby
- PHP

## Performance
- Average response time: < 50ms
- 99.9% uptime SLA

## Notes
- All calculations are performed with double-precision floating-point format
- Results are not rounded and retain full precision