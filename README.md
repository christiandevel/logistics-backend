# Logistics Backend

A robust backend service for logistics management built with Node.js, Express, and TypeScript. This project implements a clean architecture pattern and provides a RESTful API for logistics operations.

## 🚀 Technologies

- **Runtime Environment:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT
- **Documentation:** Swagger/OpenAPI
- **Email Service:** Nodemailer
- **Package Manager:** pnpm
- **Real-time Communication:** Socket.IO

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- pnpm (recommended) or npm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd logistics-backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration values.

## ⚙️ Configuration

The following environment variables need to be configured in your `.env` file:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_TYPE`: Database type (postgres)

### Database Configuration (Render.com)

To set up the database using Render.com:

1. Create an account at [Render.com](https://render.com)
2. Create a new PostgreSQL database from the dashboard
3. Once created, Render will provide you with the connection details
4. Configure the following environment variables with your Render database credentials:

```
POSTGRES_HOST=your-render-database-host
POSTGRES_PORT=5432
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
```

Note: Replace the placeholder values with the actual credentials from your Render PostgreSQL database connection string.

### Email Configuration (Mailtrap.io)

To set up email testing using Mailtrap.io:

1. Create an account at [Mailtrap.io](https://mailtrap.io)
2. Create a new inbox in your Mailtrap account
3. Go to the inbox settings and select "SMTP Settings"
4. Configure the following environment variables with your Mailtrap credentials:

```
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
```

Note: Replace `your_mailtrap_username` and `your_mailtrap_password` with the actual credentials from your Mailtrap inbox SMTP settings.

- `FRONTEND_URL`: Frontend application URL

## 🚀 Running the Application

### Development Mode
```bash
pnpm dev
```
This will start the server in development mode with hot-reload enabled.

### Production Mode
```bash
pnpm build
pnpm start
```

### Docker Deployment

To run the application using Docker:

1. Build and start all services:
```bash
docker-compose up --build
```

2. To run in detached mode:
```bash
docker-compose up -d --build
```

3. To stop all services:
```bash
docker-compose down
```

4. To view logs:
```bash
docker-compose logs -f
```

The application will be available at `http://localhost:3000`

Note: The Docker setup includes:
- Node.js application container
- PostgreSQL database container
- Redis container
- Persistent volumes for database and Redis data
- Internal network for service communication

## 🏗️ Project Structure

The project follows Clean Architecture principles with the following structure:

```
src/
├── application/     # Application use cases and business logic
├── domain/         # Domain entities and interfaces
├── infrastructure/ # External services implementation
├── server/         # Server configuration and middleware
├── types/          # TypeScript type definitions
└── tests/          # Test files
```

## 📚 API Documentation

The API documentation is available through Swagger UI when the server is running:
```
http://localhost:3000/api-docs
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Environment variable protection
- Input validation using Joi

## 🧪 Testing

To run tests:
```bash
pnpm test
```

## 📦 Dependencies

### Main Dependencies
- express: Web framework
- pg: PostgreSQL client
- redis: Redis client
- socket.io: Real-time communication
- swagger-jsdoc & swagger-ui-express: API documentation
- nodemailer: Email service
- jsonwebtoken: Authentication
- bcrypt: Password hashing
- cors: Cross-origin resource sharing
- joi: Data validation

### Development Dependencies
- typescript: TypeScript compiler
- ts-node-dev: Development server with hot-reload
- Various TypeScript type definitions (@types/*)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. 