import axios from 'axios';

export class ScheduleMonitor {
  constructor() {}

  async startWatching() {
    await this.checkSchedule();
    //setTimeout(this.checkSchedule, 5000);
  }

  async checkSchedule() {
    const url = `https://statsapi.web.nhl.com/api/v1/schedule`;
    const response = await axios.get(url);
    const games = response.data.dates[0].games;
    const liveGames = [];
    for (const game of games) {
      if (game.status.abstractGameState === 'Live') {
        const liveGame = new LiveGame(game.gamePk);
        await liveGame.startIngesting();
      }
    }
    for (const liveGame of liveGames) {
      if (game.status.abstractGameState === 'Final') {
        liveGame.stopIngesting();
      }
    }
  }
}

class LiveGame {
  constructor(gamePk) {
    this.gamePk = gamePk;
    this.isIngesting = false;
  }
  async sleep(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async startIngesting() {
    this.isIngesting = true;
    while (this.isIngesting) {
      await this.ingestGameData();
      await this.sleep(5000);
      console.log('hello');
    }
  }
  stopIngesting() {
    this.isIngesting = false;
  }

  async ingestGameData() {
    const url = `https://statsapi.web.nhl.com/api/v1/game/${this.gamePk}/feed/live`;
    const response = await axios.get(url);
    console.log(JSON.stringify(response.data));
    const gameData = response.data;
    //const game = new Game(gameData);
    // await game.saveToDatabase();
  }
}
