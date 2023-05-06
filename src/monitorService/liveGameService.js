import axios from 'axios';
export class LiveGame {
  constructor(gamePk, databaseClient) {
    this.gamePk = gamePk;
    this.isIngesting = false;
    this.databaseClient = databaseClient;
  }

  async startIngesting() {
    this.isIngesting = true;
    while (this.isIngesting) {
      await this.ingestGameData();
      await sleep(5000);
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
    this.databaseClient.writeNhlPlayerData(gameData);
  }
}
async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
