# Virtual Semiconductor Doping and Electrical Behaviour Model

This project now uses:

- Flask backend for simulation APIs
- React (Vite) frontend for UI and graphics
- Recharts for simulation plots shown after clicking Run Simulation

## Project Structure

- `app.py`: Flask API and static serving of built React app
- `simulator.py`: first-order semiconductor simulation model
- `frontend/`: React application source

## Run in Development (two terminals)

### Terminal 1 (backend)

```cmd
cd /d C:\Users\Harshit\Virtual-Semiconductor-Doping-and-Electrical-Behaviour-Model
.\.venv\Scripts\activate
python app.py
```

### Terminal 2 (frontend)

```cmd
cd /d C:\Users\Harshit\Virtual-Semiconductor-Doping-and-Electrical-Behaviour-Model\frontend
npm install
npm run dev
```

Open: `http://127.0.0.1:5173`

## Run as Single Flask-Hosted Build

```cmd
cd /d C:\Users\Harshit\Virtual-Semiconductor-Doping-and-Electrical-Behaviour-Model\frontend
npm install
npm run build

cd /d C:\Users\Harshit\Virtual-Semiconductor-Doping-and-Electrical-Behaviour-Model
.\.venv\Scripts\activate
python app.py
```

Open: `http://127.0.0.1:5000`