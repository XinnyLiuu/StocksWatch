import * as auth from '../utils/auth.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import localStorageMock from './__mocks__/localStorageMock.js'
import mockStock from './__mocks__/mock_stock.json'

localStorageMock.setItem('stocks', JSON.stringify(mockStock));
localStorageMock.setItem('isAuth', true);
localStorageMock.setItem('firstname', 'Johnny');
localStorageMock.setItem('lastname', 'Test');
localStorageMock.setItem('username', 'Tester1234');
localStorageMock.setItem('id', '1');
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import User from '../model/User';


describe('auth utility', () => {
  it('should check authentication', () => {
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('should get cached user data', () => {
    const user = auth.getUserInfo();
    expect(user.firstName + ' ' + user.lastName).toBe('Johnny Test');
  });

  it('should set user data into session data', () => {
    const user = new User(2, 'Shenmue3', 'Ryo', 'Hazuki', false, mockStock)

    auth.setSession(user);

    expect(localStorageMock.getItem('firstname') + ' ' + localStorageMock.getItem('lastname')).toBe('Ryo Hazuki')
  });

  it('should destroy the session', () => {
    auth.destroySession();

    expect(localStorageMock.getItem('isAuth')).toBe(null);
  });
});

