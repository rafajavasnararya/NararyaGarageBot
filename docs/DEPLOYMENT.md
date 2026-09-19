# Deployment
Install Node.js 20 or newer.
Copy deploy/.env.example to .env.
Install bot dependencies with npm install inside bot.
Install web dependencies with npm install inside web.
Run the bot with npm start.
Run the dashboard with npm start.
Docker Compose can run both services.
Python helper scripts require Python 3.10 or newer.
Before production, configure a payment provider and secure the dashboard.
Do not expose WhatsApp auth files.
Use a reverse proxy and HTTPS for public dashboard access.