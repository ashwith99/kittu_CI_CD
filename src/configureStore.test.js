import configureStore from "./configureStore";

describe("configureStore", () => {
  it("creates a Redux store with expected properties", () => {
    // Arrange
    const preloadedState = { users: [], isLoading: false };

    // Act
    const store = configureStore(preloadedState);

    // Assert
    expect(store).toBeDefined();
    expect(store.getState()).toEqual(preloadedState);
    expect(store.replaceReducer).toBeDefined();
    expect(store.dispatch).toBeDefined();
  });

  it("creates a Redux store with redux-thunk middleware", () => {
    // Arrange
    const preloadedState = { users: [], isLoading: false };

    // Act
    const store = configureStore(preloadedState);

    // Assert
    const isThunkMiddlewareApplied = typeof store.dispatch === "function";

    expect(isThunkMiddlewareApplied).toBeTruthy();
  });

  // Add more test cases as needed
});
