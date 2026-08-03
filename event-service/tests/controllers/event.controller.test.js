const request = require('supertest');
const { createApp } = require('../../src/app');

jest.mock('../../src/middlewares/auth', () => ({
  attachAuthContext: (req, res, next) => {
    req.user = { id: 'test-user', role: 'organizer' };
    next();
  },
  requireAuth: (req, res, next) => next(),
  requireRole: () => (req, res, next) => next(),
}));

jest.mock('../../src/services/event.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    listEvents: jest.fn().mockResolvedValue({
      items: [{ eventId: '1', title: 'Test Event' }],
      pagination: { total: 1, totalPages: 1 },
    }),
    getEventDetails: jest.fn().mockResolvedValue({ eventId: '1', title: 'Test Event' }),
    createEvent: jest.fn().mockResolvedValue({ eventId: 'new-id', title: 'New Event' }),
  })),
}));

jest.mock('../../src/repositories/event.repository', () => ({
  EventRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('../../src/clients/inventory.client', () => ({
  InventoryClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('../../src/config/cognito', () => ({
  verifier: { verify: jest.fn() },
}));

describe('Event Controller APIs', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/v1/events', () => {
    it('should return a list of events', async () => {
      const res = await request(app).get('/api/v1/events');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
    });
  });

  describe('POST /api/v1/events', () => {
    it('should successfully create a new event', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .send({
          title: 'New Event',
          description: 'A great event',
          category: 'Music',
          venue: 'Stadium',
          city: 'Singapore',
          eventDate: '2028-01-01',
          eventTime: '18:00',
          ticketPrice: 50,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.eventId).toBe('new-id');
    });
  });
});
