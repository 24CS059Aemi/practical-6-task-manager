# Practical 11: Containerization with Docker and Docker Compose

## Architecture

Docker Compose runs the React/Vite frontend, Express API, and MongoDB on a private bridge network. The frontend is built in a Node.js stage and served as static files by Nginx. MongoDB data is stored in the named `mongodb_data` volume.

The browser calls the API through the published host address `http://localhost:5000`. The backend connects to MongoDB through the Compose DNS name `mongodb`, not `localhost`.

## Run the application

1. Install and start Docker Desktop. In PowerShell at the repository root, verify:

   ```powershell
   docker --version
   docker compose version
   ```

2. Start all services with one command:

   ```powershell
   docker compose up --build
   ```

   Compose builds the frontend and backend images, waits for MongoDB and backend health checks, then starts the frontend. Keep this terminal open to see service logs.

3. Open the frontend at [http://localhost:5173](http://localhost:5173). The API is published at `http://localhost:5000`.

4. In a second terminal, confirm all three services are running:

   ```powershell
   docker compose ps
   ```

5. For end-to-end verification, register or log in through the frontend, then create a task. Task data persists in the `mongodb_data` named volume across container restarts.

6. Stop the stack with `Ctrl+C`, then run `docker compose down`. This stops and removes the containers but keeps the named MongoDB data volume.

## Configuration and notes

- Compose uses a local-only fallback JWT secret for this classroom practical. Set a private `JWT_SECRET` in the shell or a root `.env` file for local use; never commit real secrets.
- The API uses `MONGODB_URI=mongodb://mongodb:27017/taskdb_practical10` inside the Compose network.
- `EXPOSE` in a Dockerfile documents a container port. Compose `ports` publishes a container port to the host, allowing the browser and tools to connect.
- Each service has a `.dockerignore` excluding `node_modules`, environment files, and other non-build inputs.
- MongoDB data persists in `mongodb_data`; `docker compose down` does not delete it.

## Suggested output screenshots

Capture with **Win + Shift + S**. Keep secrets, passwords, and bearer tokens out of screenshots.

1. Run `docker compose up --build` and capture the terminal showing the services start and the API connect to MongoDB.
   *Figure 1: Docker Compose builds and starts the frontend, backend, and MongoDB services.*
2. In a second terminal, run `docker compose ps` and capture all three services in the running/healthy state.
   *Figure 2: Docker Compose shows all application containers running.*
3. Open `http://localhost:5173` and capture the Task Manager frontend.
   *Figure 3: Task Manager frontend served from its Docker container.*
4. Optionally capture a successful task creation from the UI or Postman to show end-to-end frontend/API/database connectivity. Hide credentials and tokens.
   *Figure 4: Task created successfully through the containerized application.*

## Conclusion

In this practical, I containerized the React frontend and Express backend and orchestrated them with MongoDB using Docker Compose. A multi-stage frontend build creates static assets served by Nginx, while the backend reaches MongoDB through the Compose service name on a private bridge network. Port mappings make the frontend and API accessible from the host, health checks coordinate startup, and a named volume preserves MongoDB data across restarts. The full stack can be started with `docker compose up --build`.
