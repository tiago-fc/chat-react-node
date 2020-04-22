jest.mock('node-localstorage', () => {
    function LocalStorageMock (location) {
        this.location = location;
        this.setItem = jest.fn();
        this.getItem = jest.fn();
    };
  
    return {LocalStorage: LocalStorageMock}
});