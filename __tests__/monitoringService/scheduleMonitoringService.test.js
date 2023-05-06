import { ScheduleMonitor } from '../../src/monitorService/scheduleMonitoringService.js';
import { LiveGame } from '../../src/monitorService/liveGameService.js';
import axios from 'axios';

jest.mock('axios');

describe('ScheduleMonitor', () => {
  let scheduleMonitor;
  let databaseClient;

  beforeEach(() => {
    databaseClient = { writeNhlPlayerData: jest.fn() };
    scheduleMonitor = new ScheduleMonitor(databaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startWatching', () => {
    it('should call checkSchedule and sleep for 5 seconds', async () => {
      jest.spyOn(scheduleMonitor, 'checkSchedule').mockResolvedValue(undefined);
      jest.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
        callback();
        return 1234;
      });

      await scheduleMonitor.startWatching();

      expect(scheduleMonitor.checkSchedule).toHaveBeenCalled();
      expect(global.setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        5000
      );
    });
  });

  describe('checkSchedule', () => {
    const mockGames = [
      { gamePk: 1, status: { abstractGameState: 'Live' } },
      { gamePk: 2, status: { abstractGameState: 'Final' } },
      { gamePk: 3, status: { abstractGameState: 'Preview' } },
    ];
    const mockResponse = {
      data: { dates: [{ games: mockGames }] },
    };

    it('should ingest data for live games and stop ingesting for finished games', async () => {
      axios.get.mockResolvedValue(mockResponse);
      jest
        .spyOn(LiveGame.prototype, 'startIngesting')
        .mockResolvedValue(undefined);
      jest.spyOn(LiveGame.prototype, 'stopIngesting').mockImplementation(() => {
        scheduleMonitor.isIngesting = false;
      });

      await scheduleMonitor.checkSchedule();

      expect(axios.get).toHaveBeenCalledWith(
        'https://statsapi.web.nhl.com/api/v1/schedule'
      );
      expect(LiveGame.prototype.startIngesting).toHaveBeenCalled();
    });

    it('should not create a LiveGame instance for games that are already being ingested', async () => {
      axios.get.mockResolvedValue(mockResponse);
      jest
        .spyOn(LiveGame.prototype, 'startIngesting')
        .mockResolvedValue(undefined);
      jest.spyOn(LiveGame.prototype, 'stopIngesting').mockImplementation(() => {
        scheduleMonitor.isIngesting = false;
      });

      // Start ingesting for one game
      const liveGame = new LiveGame(1, databaseClient);
      jest.spyOn(liveGame, 'startIngesting').mockResolvedValue(undefined);
      jest.spyOn(liveGame, 'stopIngesting').mockImplementation(() => {
        scheduleMonitor.isIngesting = false;
      });
      await liveGame.startIngesting();

      // Run checkSchedule
      await scheduleMonitor.checkSchedule();

      expect(LiveGame.prototype.startIngesting).toHaveBeenCalledTimes(2);
      expect(LiveGame.prototype.startIngesting).toHaveBeenCalledWith();
      expect(LiveGame.prototype.stopIngesting).not.toHaveBeenCalled();
    });

    it('should not create a LiveGame instance for games that are not live', async () => {
      axios.get.mockResolvedValue(mockResponse);
      jest
        .spyOn(LiveGame.prototype, 'startIngesting')
        .mockResolvedValue(undefined);
      jest.spyOn(LiveGame.prototype, 'stopIngesting').mockImplementation(() => {
        scheduleMonitor.isIngesting = false;
      });
    });
  });
});
