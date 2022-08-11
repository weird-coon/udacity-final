require('regenerator-runtime/runtime');
const getTripInfo = require('../api');

describe('getTripInfo', () => {
  test('Should return bad request response when req is empty', async () => {
    const responseMock = await getTripInfo('');
    expect(responseMock).toEqual({
      status: 400,
      message: 'Bad request',
    });
  });

  test('Should return not found status when req invalid location', async () => {
    const responseMock = await getTripInfo('Hello test');
    expect(responseMock?.status).toBe(404);
  });

  test('Should fetch success location', async () => {
    const responseMock = await getTripInfo('New york');
    expect(responseMock?.status).toBe(200);
  });
});
