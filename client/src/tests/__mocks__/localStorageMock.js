import mockData from '../__mocks__/mock_stock.json'

const localStorageMock = (() => {
  var store = {
  };
  return {
    getItem: (key) => {
      return store[key];
    },
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

module.exports = localStorageMock;