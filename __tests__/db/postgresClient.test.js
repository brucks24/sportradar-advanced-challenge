import { Sequelize } from 'sequelize';
import { DatabaseClient } from '../../src/db/postgresClient.js';

describe('DatabaseClient', () => {
  let dbClient;

  beforeAll(() => {
    const sequelize = new Sequelize('database_name', 'username', 'password', {
      host: 'localhost',
      dialect: 'postgres',
    });
    dbClient = new DatabaseClient(sequelize);
  });

  afterAll(async () => {
    await dbClient.disconnect();
  });

  describe('connect', () => {
    it('should successfully connect to the database', async () => {
      await expect(dbClient.connect()).resolves.not.toThrow();
    });
  });

  describe('disconnect', () => {
    it('should successfully disconnect from the database', async () => {
      await expect(dbClient.disconnect()).resolves.not.toThrow();
    });
  });

  describe('writeNHLPlayerData', () => {
    it('should successfully write NHL player data to the database', async () => {
      const nhlPlayerData = [
        {
          playerId: 1,
          playerName: 'John Doe',
          teamId: 1,
          teamName: 'New York Rangers',
          playerAge: 25,
          playerNumber: 10,
          playerPosition: 'Forward',
          assists: 5,
          goals: 10,
          hits: 20,
          points: 15,
          penaltyMinutes: 10,
          opponentTeam: 'New York Islanders',
        },
        {
          playerId: 2,
          playerName: 'Jane Smith',
          teamId: 2,
          teamName: 'New Jersey Devils',
          playerAge: 23,
          playerNumber: 20,
          playerPosition: 'Defense',
          assists: 2,
          goals: 5,
          hits: 10,
          points: 7,
          penaltyMinutes: 8,
          opponentTeam: 'Philadelphia Flyers',
        },
      ];

      await expect(
        dbClient.writeNHLPlayerData(nhlPlayerData)
      ).resolves.not.toThrow();
    });
  });
});
