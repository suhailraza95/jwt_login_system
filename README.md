# JWT Login System API

A Node.js and Express API for JWT-based authentication with email OTP verification, refresh tokens, API key protection, password reset, Swagger UI, Redoc, and an OpenAPI YAML specification.

## Features

- User registration with required consent fields
- Email OTP verification
- Login with access token and refresh token
- Refresh access token endpoint
- Logout endpoint
- Forgot password and reset password flow
- API key middleware using the `x-api-key` header
- MongoDB persistence with Mongoose
- Swagger UI and Redoc API documentation
- Postman collection included in `docs/postman`

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- nodemailer
- Swagger UI Express
- Redoc Express
- yamljs

## Project Structure

```text
jwt_system/
├── app.js
├── config/
├── controllers/
├── docs/
│   ├── openapi.yaml
│   └── postman/
├── middleware/
├── models/
├── resources/
├── routes/
├── schema/
├── services/
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the project root before starting the server.

```env
PORT=5004
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/jwt_system
JWT_SECRET=replace_with_a_long_random_access_token_secret
JWT_REFRESH_SECRET=replace_with_a_long_random_refresh_token_secret
API_KEY=replace_with_a_private_api_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Environment Key Notes

| Key | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | Port used by `app.listen`. Example: `5004`. |
| `NODE_ENV` | No | Runtime environment label used by system status routes. |
| `MONGO_URL` | Yes | MongoDB connection string used by Mongoose. |
| `JWT_SECRET` | Yes | Secret used to sign and verify access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign and verify refresh tokens. |
| `API_KEY` | Yes | Value clients must send in the `x-api-key` header. |
| `EMAIL_USER` | Yes | Gmail address used by nodemailer to send OTP emails. |
| `EMAIL_PASS` | Yes | Gmail app password for `EMAIL_USER`. Do not use your normal Gmail password. |

Keep `.env` out of Git. Commit an `.env.example` file instead if you want to share the required keys safely.

## Installation

Install dependencies:

```bash
npm install
```

Start MongoDB locally or make sure `MONGO_URL` points to a reachable MongoDB instance.

Start the API:

```bash
node app.js
```

The server runs at:

```text
http://localhost:5004
```

## API Documentation

After the server is running, open:

- Swagger UI: `http://localhost:5004/docs/swaggerui`
- Redoc: `http://localhost:5004/docs/redoc`
- OpenAPI YAML: `http://localhost:5004/docs/openapi.yaml`

The OpenAPI source file is located at:

```text
docs/openapi.yaml
```

The Postman collection is located at:

```text
docs/postman/jwt-login-system.postman_collection.json
```

## API Key Header

Protected API routes require this header:

```http
x-api-key: your-api-key
```

The value must match `API_KEY` in your `.env` file.

## Endpoints

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| POST | `/api/register` | Yes | Register a user and send email verification OTP |
| POST | `/api/login` | Yes | Login verified user and return tokens |
| POST | `/api/refresh-token` | Yes | Issue a new access token |
| POST | `/api/logout` | Yes | Logout user |
| POST | `/api/verifyotp` | Yes | Verify email OTP |
| POST | `/api/forgot-password` | Yes | Send password reset OTP |
| POST | `/api/reset-password` | Yes | Reset password using OTP |

## Example Request

```bash
curl -X POST http://localhost:5004/api/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "username": "suhailraza",
    "email": "suhailhome96@gmail.com",
    "password": "StrongPass@123",
    "privacyPolicyConsent": true,
    "termsOfServiceConsent": true,
    "marketingConsent": false,
    "aiProcessingConsent": true
  }'
```

## Notes

- Use a Gmail app password for `EMAIL_PASS` when using Gmail with nodemailer.
- Use long, random values for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `API_KEY`.
- Do not commit real secrets, tokens, database URLs, or email credentials.
