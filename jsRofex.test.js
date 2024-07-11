const axios = require('axios');
const rofexClient = require('./jsRofex');

jest.mock('axios');

jest.mock('ws', () => {
  const mockWsInstance = {
    on: jest.fn(),
    send: jest.fn()
  };
  return jest.fn(() => mockWsInstance);
});

test('rofexClient._login - successful login', async () => {
  axios.post.mockResolvedValue({
    status: 200,
    headers: {
      'x-auth-token': 'valid-token'
    }
  });

  const client = new rofexClient('user', 'pass', false);
  const loginResult = await client._login();
  expect(loginResult.status).toBe('OK');
  expect(client._authenticated).toBe(true);
  expect(client._accessToken).toBe('valid-token');
});

test('rofexClient._queryGet - successful GET request', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { someData: 'data' }
  });

  const client = new rofexClient('user', 'password', false);
  client._authenticated = true;
  const url = 'https://api.remarkets.primary.com.ar/some/endpoint';
  const data = await client._queryGet(url);
  expect(data).toEqual({ someData: 'data' });
});

test('rofexClient.getAccounts - successful request', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { accounts: {} }
  });

  const client = new rofexClient('user', 'pass', false);
  client._authenticated = true;

  await client.getAccounts();

  expect(client.accounts).toEqual({});
});

test('rofexClient.getSegments - successful request', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { segments: ['segment1', 'segment2'] }
  });

  const client = new rofexClient('user', 'password', false);
  client._authenticated = true;
  const data = await client.getSegments();

  expect(data).toEqual({ segments: ['segment1', 'segment2'] });
});

test('rofexClient.getInstruments - successful request', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: { instruments: ['instrument1', 'instrument2'] }
  });

  const client = new rofexClient('user', 'password', false);
  client._authenticated = true;
  const data = await client.getInstruments();

  expect(data).toEqual({ instruments: ['instrument1', 'instrument2'] });
});

test('rofexClient.connectWS - successful connection', async () => {
  const client = new rofexClient('fakeUser', 'fakePassword', false);
  client._authenticated = true;

  const wsInstance = await client.connectWS();
  expect(wsInstance).toBeDefined();
  expect(wsInstance.on).toHaveBeenCalled();
  expect(wsInstance.send).not.toHaveBeenCalled(); // Example assertion, customize as needed
});

test('rofexClient.subscribe - successful subscription', async () => {
  const client = new rofexClient('fakeUser', 'fakePassword', false);
  client._authenticated = true;

  const wsInstance = await client.connectWS(); // Ensure WebSocket is connected before subscribing
  expect(wsInstance).toBeDefined();

  const request = { someData: 'data' };
  client.subscribe(request);
  expect(wsInstance.send).toHaveBeenCalledWith(JSON.stringify(request));
});