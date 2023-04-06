import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then((res) => {
        closeModal();
        history.push('/home/groups')
    })
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className="logInDivOuter">
      <div className="logInTopDiv">
        <img src='data:image/png;base64,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' id="meetupIcon" />
        <div id="logInText">Log In</div>
      </div>
      <form onSubmit={handleSubmit} className="logInForm">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="logInDiv">
          <label className="label">
            Email or Username
          </label>
          <input
            className="inputEmailClass"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <label className="label">
            Password
          </label>
          <input
            className="inputPasswordClass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="logInButton">Log In</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
