# 📡 API Documentation

Complete documentation for the NASA API Explorer backend endpoints.

## 🌐 Base URL

```
Development: http://localhost:5001/api
Production: https://your-backend-domain.com/api
```

## 🔑 Authentication

Most endpoints use NASA's public API key. No authentication required for client requests to our backend.

## 📊 Response Format

All endpoints return JSON responses with the following structure:

**Success Response:**
```json
{
  "data": "...",
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "status": "error"
}
```

## 🛰️ NASA API Endpoints

### Astronomy Picture of the Day (APOD)

**GET** `/nasa/apod`

Get NASA's Astronomy Picture of the Day.

**Query Parameters:**
- `date` (string, optional): YYYY-MM-DD format
- `count` (number, optional): Number of random images (1-100)
- `start_date` (string, optional): Start date for date range
- `end_date` (string, optional): End date for date range

**Example:**
```bash
GET /nasa/apod?count=5
GET /nasa/apod?date=2023-12-25
```

**Response:**
```json
[
  {
    "date": "2023-12-25",
    "explanation": "Description of the image...",
    "hdurl": "https://apod.nasa.gov/apod/image/...",
    "media_type": "image",
    "title": "Image Title",
    "url": "https://apod.nasa.gov/apod/image/..."
  }
]
```

### Mars Rover Photos

**GET** `/nasa/mars-photos/:rover`

Get photos from Mars rovers.

**Path Parameters:**
- `rover` (string): curiosity, opportunity, spirit, perseverance, ingenuity

**Query Parameters:**
- `sol` (number, optional): Martian sol (day)
- `earth_date` (string, optional): YYYY-MM-DD format
- `camera` (string, optional): Camera abbreviation
- `page` (number, optional): Page number

**Example:**
```bash
GET /nasa/mars-photos/curiosity?sol=1000
GET /nasa/mars-photos/perseverance?earth_date=2023-12-25
```

### Near Earth Objects (NEO)

**GET** `/nasa/neo/feed`

Get Near Earth Objects for a date range.

**Query Parameters:**
- `start_date` (string, optional): YYYY-MM-DD format
- `end_date` (string, optional): YYYY-MM-DD format

**Example:**
```bash
GET /nasa/neo/feed?start_date=2023-12-25&end_date=2023-12-26
```

**GET** `/nasa/neo/:id`

Get specific NEO by ID.

**Path Parameters:**
- `id` (string): NEO ID

### Earth Polychromatic Imaging Camera (EPIC)

**GET** `/nasa/epic/:collection`

Get EPIC Earth images.

**Path Parameters:**
- `collection` (string): natural or enhanced

**Query Parameters:**
- `date` (string, optional): YYYY-MM-DD format

**Example:**
```bash
GET /nasa/epic/natural
GET /nasa/epic/enhanced?date=2023-12-25
```

### NASA Image Library

**GET** `/nasa/images/search`

Search NASA's image and video library.

**Query Parameters:**
- `q` (string): Search query
- `media_type` (string, optional): image, video, audio
- `year_start` (string, optional): Start year
- `year_end` (string, optional): End year
- `page` (number, optional): Page number

**Example:**
```bash
GET /nasa/images/search?q=mars&media_type=image
```

## 🚀 SpaceX API Endpoints

### Launches

**GET** `/spacex/launches`

Get all SpaceX launches.

**Query Parameters:**
- `limit` (number, optional): Limit results
- `offset` (number, optional): Offset results
- `sort` (string, optional): Sort field
- `order` (string, optional): asc or desc

**GET** `/spacex/launches/upcoming`

Get upcoming SpaceX launches.

**GET** `/spacex/launches/past`

Get past SpaceX launches.

**GET** `/spacex/launches/latest`

Get latest SpaceX launch.

**GET** `/spacex/launches/next`

Get next SpaceX launch.

**GET** `/spacex/launches/:id`

Get specific launch by ID.

### Rockets

**GET** `/spacex/rockets`

Get all SpaceX rockets.

**GET** `/spacex/rockets/:id`

Get specific rocket by ID.

### Company Info

**GET** `/spacex/company`

Get SpaceX company information.

## 🛰️ ISS Tracking Endpoints

### Current Position

**GET** `/iss/position`

Get current ISS position.

**Response:**
```json
{
  "iss_position": {
    "latitude": "45.123",
    "longitude": "-122.456"
  },
  "message": "success",
  "timestamp": 1640995200
}
```

### Astronauts in Space

**GET** `/iss/astronauts`

Get list of astronauts currently in space.

**Response:**
```json
{
  "people": [
    {
      "name": "Astronaut Name",
      "craft": "ISS"
    }
  ],
  "number": 7,
  "message": "success"
}
```

### ISS Pass Times

**GET** `/iss/pass`

Get ISS pass times for a location.

**Query Parameters:**
- `lat` (number, required): Latitude
- `lon` (number, required): Longitude
- `alt` (number, optional): Altitude in meters
- `n` (number, optional): Number of passes (1-100)

**Example:**
```bash
GET /iss/pass?lat=45.123&lon=-122.456
```

### Location Lookup

**GET** `/iss/location`

Reverse geocode coordinates to location name.

**Query Parameters:**
- `lat` (number, required): Latitude
- `lon` (number, required): Longitude

## 📰 Space News Endpoints

### Articles

**GET** `/spacenews/articles`

Get space news articles.

**Query Parameters:**
- `limit` (number, optional): Limit results (1-100)
- `offset` (number, optional): Offset results
- `search` (string, optional): Search query
- `news_site` (string, optional): Filter by news site
- `published_at_gte` (string, optional): Published after date
- `published_at_lte` (string, optional): Published before date

**GET** `/spacenews/articles/:id`

Get specific article by ID.

### Blogs

**GET** `/spacenews/blogs`

Get space blogs (same parameters as articles).

**GET** `/spacenews/blogs/:id`

Get specific blog by ID.

### Reports

**GET** `/spacenews/reports`

Get space reports (same parameters as articles).

**GET** `/spacenews/reports/:id`

Get specific report by ID.

## 🔧 Utility Endpoints

### Health Check

**GET** `/health`

Check API server health.

**Response:**
```json
{
  "status": "OK",
  "message": "NASA API Backend Server is running",
  "timestamp": "2023-12-25T12:00:00.000Z",
  "uptime": 3600.123
}
```

### API Info

**GET** `/`

Get API information and available endpoints.

## ⚠️ Error Codes

- `400` - Bad Request: Invalid parameters
- `404` - Not Found: Endpoint or resource not found
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error
- `503` - Service Unavailable: External API unavailable

## 📊 Rate Limiting

- NASA API: 1000 requests per hour (with API key)
- SpaceX API: No official rate limit
- Space News API: No official rate limit
- ISS API: No official rate limit

## 🔍 Examples

### Get Today's APOD
```bash
curl "http://localhost:5001/api/nasa/apod"
```

### Get ISS Position
```bash
curl "http://localhost:5001/api/iss/position"
```

### Get Upcoming SpaceX Launches
```bash
curl "http://localhost:5001/api/spacex/launches/upcoming?limit=5"
```

### Search Space News
```bash
curl "http://localhost:5001/api/spacenews/articles?limit=10&search=mars"
```

---

**For more information, visit the [NASA API Documentation](https://api.nasa.gov/) and [SpaceX API Documentation](https://docs.spacexdata.com/)**
