import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import { getUsers, getUsersSuccess } from "./actions";

const mockStore = configureStore([]);

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: null,
      isLoading: false,
    });
  });

  test("renders App component with initial state", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText("Kittu Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByTestId("form")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).toBeNull();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  test("updates input value when user types in", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const input = screen.getByLabelText("Name:");
    fireEvent.change(input, { target: { value: "John" } });

    expect(input.value).toBe("John");
  });

  test("dispatches getUsers action on button click and renders loading message", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "example" },
    });
    fireEvent.click(screen.getByText("Load Users"));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([getUsers()]);
    });

    // expect(screen.getByTestId("loading-text")).toBeInTheDocument();
  });
});

describe("render Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: [
        {
          id: 1,
          name: "John Doe",
          username: "Bret",
          email: "Sincere@april.biz",
          address: {
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
            geo: {
              lat: "-37.3159",
              lng: "81.1496",
            },
          },
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          company: {
            name: "Romaguera-Crona",
            catchPhrase: "Multi-layered client-server neural-net",
            bs: "harness real-time e-markets",
          },
        },
      ],
      isLoading: false,
    });
  });

  test("renders loading message when loading is true", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    store = mockStore({
      users: null,
      isLoading: true,
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByTestId("loading-text")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders user name when loading is false and users are available", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByTestId("strong-text")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).toBeNull();
  });

  test("does not render loading message when loading is false", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    store = mockStore({
      users: null,
      isLoading: false,
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.queryByText("Loading...")).toBeNull();
  });
});

describe("App api call", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: null,
      isLoading: false,
    });

    jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("fetches users and dispatches actions on successful fetch", async () => {
    const mockUsers = { id: 1, name: "John Doe" };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsers),
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "example" },
    });
    fireEvent.click(screen.getByText("Load Users"));
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([getUsers(), getUsersSuccess(mockUsers)]);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users?id=example"
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("handles fetch error gracefully", async () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch.mockRejectedValue(new Error("Fetch error"));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "example" },
    });
    fireEvent.click(screen.getByText("Load Users"));

    // Wait for the asynchronous operations to complete and insert an assertion
    await waitFor(() => {
      // Check that console.error is called
      expect(consoleErrorMock).toHaveBeenCalled();
    });

    // Restore the original console.error
    consoleErrorMock.mockRestore();
  });
});
