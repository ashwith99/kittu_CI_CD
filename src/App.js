import React from "react";
import { connect } from "react-redux";
import { getUsers, getUsersSuccess } from "./actions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleLoadUsersClick = async () => {
    try {
      const value = this.state.value;

      this.setState({ value });
      this.props.onLoadUsersClick();

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?id=${value}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
      }

      const json = await response.json();
      this.props.onLoadUsersComplete(json);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      // Handle the error as needed (e.g., display an error message to the user)
    }
  };
  render() {
    const { users, loading } = this.props;

    return (
      <div className="App">
        <h1>Kittu Data</h1>
        <hr />
        <h3>Users</h3>
        <form data-testid="form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name:
            <input
              className="kittu-input"
              type="text"
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </label>
          <button
            className="load-button"
            type="button"
            onClick={this.handleLoadUsersClick}
          >
            Load Users
          </button>
        </form>
        {loading ? <p data-testid="loading-text">Loading...</p> : null}
        {!loading && users ? (
          <ul className="kittu-username">
            {this.props.users.map((user) => (
              <li key={user.id}>
                <strong data-testid="strong-text">{user.name}</strong>|{" "}
                {user.email}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  loading: state.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadUsersClick: () => {
    dispatch(getUsers());
  },
  onLoadUsersComplete: (users) => {
    dispatch(getUsersSuccess(users));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
