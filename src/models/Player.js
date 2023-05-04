import { Model, DataTypes } from 'sequelize';

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
