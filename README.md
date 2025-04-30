# Weight Tracker

A mobile-optimized web application for recording and visualizing weight data with secure user authentication.

## Table of Contents
- [About](#about)
  - [Who Is This For?](#who-is-this-for)
- [Features](#features)
- [Technologies](#technologies)
- [Deployment Instructions](#deployment-instructions)
  - [Prerequisites](#prerequisites)
  - [Production Deployment Steps](#production-deployment-steps)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
  - [Environment Variable Descriptions](#environment-variable-descriptions)
- [Development Instructions](#development-instructions)
  - [Local Development Setup](#local-development-setup)
  - [Database Management](#database-management)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About

Weight Tracker is designed for individuals who want to monitor their weight changes over time. The application provides an intuitive interface for recording weight measurements, viewing historical data in a tabular format, and visualizing trends through interactive charts.

### Who Is This For?

- **Health-conscious individuals** tracking their weight as part of a fitness journey
- **People with specific health goals** who need to monitor weight fluctuations
- **Fitness coaches** who want a simple tool to track client progress
- **Anyone interested** in logging and analyzing their weight data over time

## Features

- **User Authentication**: Secure multi-user system with registration and login
- **Password Recovery**: Self-service password reset via email
- **Mobile-optimized UI**: Responsive design works great on smartphones and tablets
- **Data Input**: Simple form for recording weight values with optional notes
- **Data Visualization**: Interactive chart showing weight trends over time
- **Data Table**: Comprehensive table view of all recorded entries
- **Secure Data Storage**: Each user can only access their own data

## Technologies

- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js for secure user management
- **Visualization**: Chart.js with react-chartjs-2
- **API**: Next.js API Routes

## Deployment Instructions

### Prerequisites

- Node.js 18.17.0 or newer
- npm or yarn package manager

### Production Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://your-repository-url/weight-tracking.git
   cd weight-tracking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure the `.env` file (see Environment Variables section below)

4. Build the application:
   ```bash
   npm run build
   ```

5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

7. Start the production server:
   ```bash
   npm start
   ```

### Docker Deployment

The application includes Docker support for containerized deployment:

1. Configure your `.env` file
2. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database configuration
DATABASE_URL="file:./prisma/dev.db?connection_limit=1"

# NextAuth.js configuration
NEXTAUTH_SECRET=your-secure-random-string-here
NEXTAUTH_URL=http://your-domain.com

# Email configuration (for password reset)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@your-domain.com
EMAIL_SERVER_SECURE=false
```

### Environment Variable Descriptions

- **DATABASE_URL**: Connection string for your database (SQLite by default)
- **NEXTAUTH_SECRET**: A random string used to encrypt cookies and tokens (use a secure random generator)
- **NEXTAUTH_URL**: The base URL of your deployed application
- **EMAIL_SERVER_***: SMTP settings for sending password reset emails
- **EMAIL_FROM**: The "from" address for outgoing emails

## Development Instructions

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://your-repository-url/weight-tracking.git
   cd weight-tracking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example above, using:
   ```
   NEXTAUTH_SECRET=any-random-string-for-development
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Management

- View your database with Prisma Studio:
  ```bash
  npx prisma studio
  ```

- Create a migration after schema changes:
  ```bash
  npx prisma migrate dev --name your_migration_name
  ```

- Reset database (deletes all data):
  ```bash
  npx prisma migrate reset --force
  ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the intuitive ORM
- Chart.js contributors for the visualization library
