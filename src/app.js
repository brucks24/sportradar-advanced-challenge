import express from 'express';
import bodyParser from 'body-parser';
import { ScheduleMonitor } from './monitorService/scheduleMonitoringService.js';
import { DatabaseClient } from './db/postgresClient.js';
import axios from 'axios';

const app = express();

// parse application/json
app.use(bodyParser.json());

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/game/:gamePk', async (req, res) => {
  const { gamePk } = req.params;

  try {
    const response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`
    );
    const gameData = response.data;

    res.json(gameData);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving game data.');
  }
});
// date is in YYYY-MM-DD
app.get('/games/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}&expand=schedule.teams,schedule.linescore`
    );
    const games = response.data.dates[0].games;

    // Return an array of games with selected data
    const result = games.map((game) => {
      const { gamePk, gameType, status, teams, linescore } = game;
      return {
        gamePk,
        gameType,
        status,
        home: teams.home.team.name,
        away: teams.away.team.name,
        homeScore: linescore.teams.home.goals,
        awayScore: linescore.teams.away.goals,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const db = new DatabaseClient();
db.connect();
const scheduleMonitor = new ScheduleMonitor(db);
scheduleMonitor.startWatching();

process.on('SIGTERM', () => {
  db.disconnect();
});
