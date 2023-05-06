import { LiveGame } from '../../src/monitorService/liveGameService.js';
import axios from 'axios';

describe('LiveGame', () => {
  let game;
  const databaseClientMock = {
    writeNhlPlayerData: jest.fn(),
  };

  beforeEach(() => {
    game = new LiveGame(1234, databaseClientMock);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('ingestGameData', () => {
    it('should call writeNhlPlayerData with gameData from API', async () => {
      const responseMock = {
        data: {
          test: 'data',
        },
      };
      axios.get = jest.fn().mockResolvedValue(responseMock);
      await game.ingestGameData();
      expect(databaseClientMock.writeNhlPlayerData).toHaveBeenCalledWith(
        responseMock.data
      );
    });
  });
});
