import express from 'express';
import bodyParser from 'body-parser';
import { ScheduleMonitor } from './monitor.js';

const app = express();

// parse application/json
app.use(bodyParser.json());

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const scheduleMonitor = new ScheduleMonitor();
scheduleMonitor.startWatching();
