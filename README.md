# Tonelab Studio

This project uses Docker to simplify setup and deployment. Follow the instructions below to install Docker and run the project.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for macOS, Windows, or Linux)

## Installation

### 1. Install Docker
- Download Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/).
- Follow the installation instructions for your operating system.
- After installation, start Docker Desktop and ensure it is running.

### 2. Clone the Repository
```
git clone <your-repo-url>
cd tonelab-studio
```

### 3. Configure Environment Variables
- Copy the example environment file (if provided) or create a `.env.local` file in the project root with the necessary variables for your app.

### 4. Build and Start the Project with Docker Compose
```
docker-compose up --build
```
- This command will build the Docker images and start the services defined in `docker-compose.yml`.
- The web application will be available at [http://localhost:3000](http://localhost:3000).
- MongoDB will run in a container and is only accessible from within the Docker network (not exposed externally).

### 5. Stopping the Project
To stop the running containers:
```
docker-compose down
```

## Additional Notes
- If you need to remove all data (including MongoDB data), you can remove the Docker volume:
  ```
  docker-compose down -v
  ```
- For development, you may want to rebuild the images if you change dependencies:
  ```
  docker-compose up --build
  ```

## Troubleshooting
- Ensure Docker Desktop is running before executing Docker commands.
- If you encounter port conflicts, make sure nothing else is running on port 3000.

---
For more information, see the official Docker documentation: https://docs.docker.com/

