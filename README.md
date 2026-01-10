# Tonelab Studio

A Next.js-based event management platform for ToneLab Studio music club in Yerevan, featuring MongoDB integration, admin authentication, and event management capabilities.

## Features

- 🎵 Public event listing and details pages
- 🔐 Secure admin authentication with NextAuth
- 📝 Full CRUD operations for event management
- 🖼️ Image and video upload support via Cloudinary
- 🎫 Integration with Showsforme ticketing platform
- 📱 Responsive design
- 🐳 Docker support for easy deployment

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for macOS, Windows, or Linux)
- Node.js 18+ (for local development without Docker)

## Installation

### Option 1: Using Docker (Recommended)

#### 1. Install Docker
- Download Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/).
- Follow the installation instructions for your operating system.
- After installation, start Docker Desktop and ensure it is running.

#### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd tonelab-studio
```

#### 3. Configure Environment Variables
Create a `.env.local` file in the project root with the required variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Connection (use this for Docker setup)
MONGODB_URI=mongodb://mongo:27017/tonelabdb

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin User Credentials
ADMIN_EMAIL=admin@tonelab.studio
ADMIN_PASSWORD=your-secure-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### 4. Build and Start with Docker Compose
```bash
docker-compose up --build
```

- The web application will be available at [http://localhost:3000](http://localhost:3000)
- MongoDB will run in a container (not exposed externally)

#### 5. Create Admin User

After the containers are running, create an admin user:

```bash
# If using Docker:
docker-compose exec web npm run seed:admin

# Or run directly in the container:
docker exec -it tonelab-studio-web-1 npm run seed:admin
```

#### 6. Stopping the Project
```bash
docker-compose down
```

To remove all data including MongoDB:
```bash
docker-compose down -v
```

### Option 2: Local Development (Without Docker)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Set Up MongoDB
Either install MongoDB locally or use MongoDB Atlas (cloud).

For MongoDB Atlas:
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

#### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Update `MONGODB_URI` with your connection string.

#### 4. Create Admin User
```bash
npm run seed:admin
```

#### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin Access

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with your admin credentials (from `.env.local`)
3. Manage events at [http://localhost:3000/admin/events](http://localhost:3000/admin/events)

### Admin Features

- **Create Event**: Click "Create Event" button on admin dashboard
- **Edit Event**: Click "Edit" on any event card
- **Delete Event**: Click "Delete" and confirm
- **Upload Media**: Support for images and videos via Cloudinary

### Public Pages

- **Events List**: [http://localhost:3000/events](http://localhost:3000/events)
- **Event Details**: Click on any event to view full details
- **Get Tickets**: Click "Get Tickets" to visit the Showsforme ticketing page

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NEXTAUTH_URL` | Base URL for NextAuth | ✅ |
| `NEXTAUTH_SECRET` | Secret for JWT signing | ✅ |
| `ADMIN_EMAIL` | Initial admin user email | ✅ (for seeding) |
| `ADMIN_PASSWORD` | Initial admin user password | ✅ (for seeding) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |

## Project Structure

```
tonelab-studio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin pages (protected)
│   │   │   ├── login/         # Admin login
│   │   │   └── events/        # Event management
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── events/        # Event CRUD
│   │   │   ├── upload-image/  # Image upload
│   │   │   └── upload-video/  # Video upload
│   │   ├── events/            # Public event pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Password hashing
│   │   ├── auth-options.ts   # NextAuth config
│   │   ├── mongodb.ts        # MongoDB connection
│   │   └── validations.ts    # Zod schemas
│   ├── models/                # Mongoose models
│   │   ├── Event.ts          # Event model
│   │   └── User.ts           # User model
│   └── middleware.ts          # Route protection
├── scripts/
│   └── seed-admin.ts         # Admin user seeding
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker configuration
└── package.json
```

## API Endpoints

### Public Endpoints

- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details

### Protected Endpoints (Admin Only)

- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication via NextAuth
- ✅ HTTP-only cookies for session management
- ✅ Route protection middleware
- ✅ Server-side validation with Zod
- ✅ CSRF protection via NextAuth

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:admin` - Create/update admin user

## Troubleshooting

### Port Conflicts
If port 3000 is already in use:
```bash
# Change port in package.json or run:
PORT=3001 npm run dev
```

### Docker Issues
- Ensure Docker Desktop is running
- Check container logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up --build`

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- For Docker: use `mongodb://mongo:27017/tonelabdb`
- For local MongoDB: use `mongodb://localhost:27017/tonelabdb`
- For Atlas: check network access and credentials

### Admin Login Issues
- Verify admin user exists: run `npm run seed:admin`
- Check `.env.local` has correct `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Ensure `NEXTAUTH_SECRET` is set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

---

For more information, visit [ToneLab Studio](https://tonelab.studio) or contact the development team.

