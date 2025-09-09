# Me-API Playground

This project is a personal portfolio backend assessment that stores my profile information in a database and exposes it via a REST API, complete with a minimal frontend for interaction.

## Live URLs

* **Frontend (Vercel):** `https://predusk-assessment-udaykiran-29s-projects.vercel.app/`
* **Backend (Render):** `https://predusk-assessment-s0na.onrender.com`

---

## Architecture

* **Frontend:** React (built with Create React App)
* **Backend:** Node.js with Express.js
* **Database:** PostgreSQL (hosted on Neon)

The React frontend communicates with the Node.js backend via REST API calls. The backend then queries the PostgreSQL database to retrieve or modify data.

---

## Database Schema

The database consists of five main tables:
* `profile`: Stores the main user information (name, email).
* `links`: Stores URLs for GitHub, LinkedIn, and portfolio.
* `skills`: A list of all skills.
* `projects`: Stores details for each project.
* `project_skills`: A join table that creates a many-to-many relationship between projects and skills.

---

## Setup & Run Locally

**Prerequisites:** Node.js, npm, and a local PostgreSQL server.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/udaykiran-29/predusk-assessment.git](https://github.com/udaykiran-29/predusk-assessment.git)
    cd predusk-assessment
    ```
2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    * Create a `.env` file and add your local PostgreSQL connection string and API key:
        ```env
        # Example for a local PostgreSQL setup
        DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME"
        API_KEY="your-secret-api-key"
        ```
    * Run the `schema.sql` and `seed.sql` files in your PostgreSQL database. (Note: The provided `schema.sql` is compatible with PostgreSQL).
    * Start the backend server:
        ```bash
        npm start
        # Server will be running on http://localhost:3001
        ```
3.  **Setup Frontend:**
    * Open a new terminal.
    ```bash
    cd frontend
    npm install
    npm start
    # Frontend will be running on http://localhost:3000
    ```

---

## API Endpoints & Sample `curl` Commands

Here are the available API endpoints:

| Method | Endpoint                    | Description                                         |
| :----- | :-------------------------- | :-------------------------------------------------- |
| `GET`  | `/health`                   | Checks the health of the server and DB connection.  |
| `GET`  | `/api/profile`              | Retrieves the main profile and links information.   |
| `GET`  | `/api/skills`               | Retrieves a list of all skills.                     |
| `GET`  | `/api/skills/top`           | Retrieves the top 5 most used skills.               |
| `GET`  | `/api/projects`             | Retrieves all projects with their associated skills.|
| `GET`  | `/api/projects?skill=React` | Retrieves projects filtered by a specific skill.    |
| `GET`  | `/api/search?q=API`         | Searches projects by a term in the title/desc.      |
| `PUT`  | `/api/profile`              | **(Protected)** Updates the profile information.    |

**Sample `curl` Commands:**
```bash
# Get all projects
curl [https://predusk-assessment-s0na.onrender.com/api/projects](https://predusk-assessment-s0na.onrender.com/api/projects)

# Get projects filtered by the skill "Node.js"
curl "[https://predusk-assessment-s0na.onrender.com/api/projects?skill=Node.js](https://predusk-assessment-s0na.onrender.com/api/projects?skill=Node.js)"

# Update profile (requires API key)
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{"name": "New Name", "email": "new@email.com", "github":"...", "linkedin":"...", "portfolio":"..."}' \
  [https://predusk-assessment-s0na.onrender.com/api/profile](https://predusk-assessment-s0na.onrender.com/api/profile)
```

---

## Known Limitations

* The frontend UI does not currently have components to use the `/search` or `/skills/top` endpoints.
* Authentication for the `PUT` endpoint is a basic API key; a more robust JWT or OAuth system would be a future improvement.

---

## Resume

You can find my resume here: `https://drive.google.com/file/d/1CIIessFl1Glmh5oC8ZPwSlIm9gCS1dyE/view?usp=drive_link`
