const { InventoryService } = require('../../src/services/inventory.service');

describe('InventoryService', () => {
  let inventoryService;
  let mockInventoryRepository;

  beforeEach(() => {
    mockInventoryRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      reserve: jest.fn(),
      release: jest.fn(),
      confirm: jest.fn(),
      updateByEventId: jest.fn(),
      setTotals: jest.fn(),
    };

    inventoryService = new InventoryService(mockInventoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reserveTickets', () => {
    it('should successfully reserve tickets if available', async () => {
      const mockInventory = { eventId: 'evt-123', availableTickets: 50, reservedTickets: 0 };
      mockInventoryRepository.reserve.mockResolvedValue(mockInventory);

      const result = await inventoryService.reserveTickets('evt-123', 5);

      expect(mockInventoryRepository.reserve).toHaveBeenCalledWith('evt-123', 5);
      expect(result).toEqual(mockInventory);
    });

    it('should throw an error if tickets are insufficient', async () => {
      mockInventoryRepository.reserve.mockResolvedValue(null);

      await expect(inventoryService.reserveTickets('evt-123', 5)).rejects.toThrow('Insufficient tickets available');
    });

    it('should throw an error if event inventory does not exist', async () => {
      mockInventoryRepository.findById.mockResolvedValue(null);
      mockInventoryRepository.reserve.mockResolvedValue(null);

      await expect(inventoryService.reserveTickets('invalid-evt', 5)).rejects.toThrow('Insufficient tickets available');
    });
  });

  describe('releaseTickets', () => {
    it('should successfully release tickets', async () => {
      const mockInventory = { eventId: 'evt-123', availableTickets: 55 };
      mockInventoryRepository.release.mockResolvedValue(mockInventory);

      const result = await inventoryService.releaseTickets('evt-123', 5);

      expect(mockInventoryRepository.release).toHaveBeenCalledWith('evt-123', 5);
      expect(result).toEqual(mockInventory);
    });
  });
});
