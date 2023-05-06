import { Model, DataTypes } from 'sequelize';
import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
  'database_name',
  'username',
  'password',
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

export class DatabaseClient {
  constructor() {
    this.client = sequelize;
  }

  async connect() {
    try {
      await this.client.authenticate();
      console.log('Connection to database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  async disconnect() {
    await this.client.close();
    console.log('Disconnected from database');
  }

  async writeNHLPlayerData(nhlPlayerData) {
    try {
      for (const key in nhlPlayerData) {
        const nhlPlayer = nhlPlayerData[key];

        const player = {
          playerId: nhlPlayer.playerId,
          playerName: nhlPlayer.playerName,
          teamId: nhlPlayer.teamId,
          teamName: nhlPlayer.teamName,
          playerAge: nhlPlayer.playerAge,
          playerNumber: nhlPlayer.playerNumber,
          playerPostion: nhlPlayer.playerPosition,
          assists: nhlPlayer.assists,
          goals: nhlPlayer.goals,
          hits: nhlPlayer.hits,
          points: nhlPlayer.points,
          penaltyMinutes: nhlPlayer.penaltyMinutes,
          opponentTeam: nhlPlayer.opponentTeam,
        };
        const newPlayer = NHLPlayer.build(player);
        await newPlayer.save();
        console.log('NHL player data written to database');
      }
    } catch (error) {
      console.error('Error writing NHL players data to database', error);
    }
  }
}
export class NHLPlayer extends Model {}

NHLPlayer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playerAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerPosition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assists: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    penaltyMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opponentTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'nhlPlayer',
  }
);
