import React, { Component, FormEvent, ChangeEvent } from "react";
import socket from "../../socket-connection";
import { connect } from "react-redux";
import { setUsername } from "../../redux/user/actions";
import Logo from "../../assets/img/logos/unicorn.png";

import { RouteComponentProps } from "react-router";
import { ISocket } from "../../socket-connection";
import { ApplicationState } from "../../redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import './style.scss';

export interface IPropsLogin extends RouteComponentProps {
  reduxStoreState: ApplicationState;
  setUsername: (username: string) => void;
}

export interface IStateLogin {
  socket: ISocket;
  username: string;
  errorMessage: string;
}

class Login extends Component<IPropsLogin, IStateLogin> {
  _isMounted: boolean = false;

  constructor(props: IPropsLogin) {
    super(props);
    this.state = {
      socket: socket.socket,
      username: "",
      errorMessage: "",
    };
  }

  componentDidMount = () => (this._isMounted = true);
  componentWillUnmount = () => (this._isMounted = false);

  loginUser = (event: FormEvent<HTMLFormElement>): void => {
    const { socket, username } = this.state;
    const { setUsername, history } = this.props;

    socket.emit(
      "add-user",
      username,
      (valid: boolean, errorMessage: string) => {
        if (valid) {
          setUsername(username);
          history.push("/rooms");
        }
        if (this._isMounted) this.setState({ errorMessage: errorMessage });
      }
    );
    event.preventDefault();
  };

  changeUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    if (this._isMounted) this.setState({ username: event.target.value });
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <div className="center-text">
        <img src={Logo} alt="Logo" />
        <h1>Game Clock</h1>
        <p>
          Enter a name, join a room and enjoy an exicing game with your friends!
        </p>
        <form onSubmit={this.loginUser} className="login-form">
          <input
            className="username"
            type="text"
            placeholder="Username..."
            onChange={this.changeUsername}
          />
          <input className="submit" type="submit" value="Login" />
        </form>
        {errorMessage != "" && <p className="form-error-message">{errorMessage}</p>}
      </div>
    );
  }
}

function mapStateToProps(reduxStoreState: ApplicationState) {
  return {
    reduxStoreState,
  };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    setUsername: (username: any) => dispatch(setUsername(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
