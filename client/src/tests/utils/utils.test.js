import * as auth from '../../utils/auth.js';
import localStorageMock from '../__mocks__/localStorageMock.js'
import mockStock from '../__mocks__/mock_stock.json'

localStorageMock.setItem('stocks', JSON.stringify(mockStock));
localStorageMock.setItem('isAuth', true);
localStorageMock.setItem('firstname', 'Johnny');
localStorageMock.setItem('lastname', 'Test');
localStorageMock.setItem('username', 'Tester1234');
localStorageMock.setItem('id', '1');
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import User from '../../model/User';

describe('Checking auth utility', () => {
	it('Should check authentication', () => {
		expect(auth.isAuthenticated()).toBe(true);
	});

	it('Should get cached user data', () => {
		const user = auth.getUserInfo();
		expect(user.firstName + ' ' + user.lastName).toBe('Johnny Test');
	});

	it('Should set user data into session data', () => {
		const user = new User(2, 'Shenmue3', 'Ryo', 'Hazuki', false, mockStock)

		auth.setSession(user);

		expect(localStorageMock.getItem('firstname') + ' ' + localStorageMock.getItem('lastname')).toBe('Ryo Hazuki')
	});

	it('Should destroy the session', () => {
		auth.destroySession();

		expect(localStorageMock.getItem('isAuth')).toBe(null);
	});
});

