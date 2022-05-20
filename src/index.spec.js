import { NextFunction, Request, Response } from 'express';
// import authorizationMiddleware from './authorization';

describe('Authorization middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('todo', async () => {
    // const expectedResponse = {
    //     "error": "Missing JWT token from the 'Authorization' header"
    // };
    // authorizationMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    // expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
