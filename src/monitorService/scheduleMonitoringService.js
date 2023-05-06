import axios from 'axios';
import { LiveGame } from './liveGameService.js';

export class ScheduleMonitor {
  constructor(databaseClient) {
    this.databaseClient = databaseClient;
  }

  async startWatching() {
    await this.checkSchedule();
    await sleep(5000);
  }

  async checkSchedule() {
    const url = `https://statsapi.web.nhl.com/api/v1/schedule`;
    const response = await axios.get(url);
    let games = response.data.dates[0].games;
    let liveGames = [];
    for (const game of games) {
      if (game.status.abstractGameState === 'Live') {
        const liveGame = new LiveGame(game.gamePk, this.databaseClient);
        await liveGame.startIngesting();
        liveGames.push(game);
        games = games.filter((game) => game !== liveGame); // have to filter out the live game so we dont continue creating instances of it as we loop through
      }
    }
    for (const liveGame of liveGames) {
      if (liveGame.status.abstractGameState === 'Final') {
        liveGame.stopIngesting();
        liveGames = liveGames.filter((game) => game !== liveGame);
      }
    }
  }
}

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
