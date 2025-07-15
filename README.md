<a id="readme-top"></a>

# Z Energy Station Locator App

A full-stack web app that displays Z Energy fuel station locations, available services, and real-time fuel prices on an interactive map with regional clustering.

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Folder Structure](#folder-structure)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

## About The Project

This is a full stack app built with React and Node.js using Mongo DB database and Google interactive maps. The app will provide location-based search functionalities, also filtering by services and fuel prices. 

## 📁 Folder Structure

```bash
Z-Station-App/
├── zApp-frontend/      # React client app (Vite)
│   ├── public/
│   ├── src/
│       ├── assets/
│       ├── components/
│           ├── ...
│       ├── images/
│   └── ...
├── zApp-backend/       # Express.js backend
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── ...
├── README.md
└── .gitignore
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

### Frontend

* React
* Vite
* React Router
* Axios
* Google Maps Platform

### Backend

* Node.js
* Express
* Mongoose
* MongoDB
* CORS

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* npm
    ```bash
    npm install npm@latest -g
    ```
* Node.js (v14 or later)

### Installation

1.  Clone the repo
    ```bash
    git clone [https://github.com/your_username/zapp.git](https://github.com/your_username/zapp.git)
    ```
2.  Navigate to the frontend directory and install NPM packages
    ```bash
    cd zapp/zapp-frontend
    npm install
    ```
3.  Navigate to the backend directory and install NPM packages
    ```bash
    cd ../zapp-backend
    npm install
    ```
4.  Create a `.env` file in both the `zapp-frontend` and `zapp-backend` directories. You'll need to add your configuration variables here (e.g., database connection strings, API keys).
    * Example `zapp-backend/.env`:
        ```
        PORT=8000
        DATABASE_URL=your_mongodb_connection_string
        ```
    * Example `zapp-frontend/.env`:
        ```
        VITE_API_BASE_URL=http://localhost:8000
        VITE_Maps_API_KEY=your_Maps_api_key
        ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Usage

### To run the app locally:

Start the backend server:

```bash
cd zApp-backend
npm run dev
```
Start the frontend dev server:

```bash
cd zApp-frontend
npm run dev
```

The frontend will run on http://localhost:5173 (or whatever Vite assigns).
Once both servers are running, open your browser and visit the frontend URL. You can now:
- Search for Z Energy stations by city or service (e.g. car wash)
- Toggle fuel price visibility and filter by fuel type
- Zoom in/out to see clustered vs individual stations on the interactive map

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing
Contributions are welcome! If you'd like to suggest improvements or fix issues:
1. Fork the repository
2. Create a feature branch (git checkout -b feature/YourFeature)
3. Commit your changes (git commit -m 'Add YourFeature')
4. Push to the branch (git push origin feature/YourFeature)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📫 Contact
Erekle Sesiashvili
[GitHub](https://github.com/smesi36/) | [LinkedIn](https://www.linkedin.com/in/erekle-sesiashvili-8b3a7b59/)<br>
Email: smesi36@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
