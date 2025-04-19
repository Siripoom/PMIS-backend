# Project Management Information System API

A backend API for managing projects, resources, budgets, and team collaboration.

## Local Development

### Prerequisites

- Node.js 16+
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Setting Up the Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pmis-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - Copy `.env.example` to `.env`

   ```bash
   cp .env.example .env
   ```

   - Edit `.env` file with your local settings

4. **Database Setup**

   - Using Docker:

   ```bash
   docker run --name pmis-db -e POSTGRES_DB=pmis_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres:13
   ```

   - Or using Docker Compose:

   ```bash
   docker-compose up -d db
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Railway Deployment Guide

### Prerequisites

- Railway account
- Git repository with your code

### Deployment Steps

1. **Push your code to a git repository**
   Make sure your repository includes:

   - Updated package.json with start script
   - railway.toml configuration
   - Updated Dockerfile
   - .env.example as a reference

2. **Create a New Project in Railway**

   - Visit [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" > "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables**

   - Add all variables from `.env.example` to your Railway project
   - Make sure to set `NODE_ENV=production`
   - Generate a strong `JWT_SECRET`

4. **Add a PostgreSQL Database**

   - In your project, click "New Service" > "Database" > "PostgreSQL"
   - Railway will automatically connect your app to the database

5. **Connect Your Services**

   - Go to your API service settings
   - Configure the required environment variables:
     - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` (use values from the database service)
     - `PORT` will be set automatically by Railway

6. **Deploy**

   - Railway will automatically deploy your application
   - Monitor the deployment logs for any errors

7. **Check Health**
   - Visit `https://<your-railway-domain>/health` to verify deployment
   - Visit `https://<your-railway-domain>/` to see the API welcome message

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:username` - Get user by username
- `PUT /api/auth/users/:user_id` - Update user
- `DELETE /api/auth/users/:user_id` - Delete user

### Project Endpoints

- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Progress Endpoints

- `POST /api/progress` - Add progress update
- `GET /api/progress/:projectId` - Get project progress

### Resources Endpoints

- `POST /api/resource` - Create a new resource
- `GET /api/resource` - Get all resources
- `GET /api/resource/:id` - Get resource by ID
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Additional endpoints for notifications, reports, and budgets are available.

## Troubleshooting

If you encounter issues during deployment:

1. **Database Connection Issues**

   - Check your database credentials in the environment variables
   - Ensure the database service is running

2. **Application Not Starting**

   - Check the deployment logs in Railway
   - Ensure all required environment variables are set

3. **Sequelize Sync Issues**

   - Railway's database might have constraints or permissions issues
   - Try setting `{ alter: false }` in the sequelize sync options

4. **Memory Issues**
   - Adjust the memory allocation for your service in Railway settings

For additional help, contact the development team or refer to the [Railway documentation](https://docs.railway.app/).
