import { useState, useEffect } from 'react';
import './App.css';
import jek from './assets/jek.gif'

// eslint-disable-next-line react/prop-types
function SuccessWindow({ onClose }) {
  return (
    <div className="success-window">
      <img className="jek" src={jek} alt="Success" />
      <p>Authentication successful!</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showSuccessWindow, setShowSuccessWindow] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'email') {
      setIsEmailValid(isValidEmail(value));
    } else if (name === 'password' && isPasswordFocused) {
      validatePassword(value);
    }
  };

  useEffect(() => {
    const calculatePasswordStrength = () => {
      const password = formData.password;
      let strength = 0;
      if (password.match(/[a-z]+/)) strength += 1;
      if (password.match(/[A-Z]+/)) strength += 1;
      if (password.match(/[0-9]+/)) strength += 1;
      if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;
      setPasswordStrength(strength);
    };

    if (isPasswordFocused) {
      calculatePasswordStrength();
    }
  }, [formData.password, isPasswordFocused]);

  const validatePassword = (password) => {
    const errors = [];
    if (!password.match(/[a-z]+/)) errors.push('Put Some Lowercase letters (a-z)');
    if (!password.match(/[A-Z]+/)) errors.push('Put Some Uppercase letters (A-Z)');
    if (!password.match(/[0-9]+/)) errors.push('Put Some Numbers 0 to 9');
    if (!password.match(/[^a-zA-Z0-9]+/)) errors.push('Put Some Special characters');
    setPasswordErrors(errors);
  };

  const handleSignUp = () => {
    setShowSuccessWindow(true);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <h2>Email & Password Authentication</h2>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={!isEmailValid && formData.email ? 'invalid' : ''}
        />
        {!isEmailValid && formData.email && (
          <p className={`error-message ${formData.email ? 'show' : ''}`}>
            Invalid email address
          </p>
        )}
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        {isPasswordFocused && (
          <>
            <div className="password-strength-bar">
              <div
                className={`strength-bar strength-${passwordStrength}`}
                style={{ width: `${(passwordStrength / 4) * 100}%`, transition: 'width 0.5s ease-in-out' }}
              ></div>
            </div>
            <ul className="password-errors">
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <p className="password-strength-text">
             {passwordStrength === 0 ? 'Weak' : passwordStrength === 1 ? 'Medium' : 'Strong'}
            </p>
          </>
        )}
      </div>
      <button className="submit-btn" onClick={handleSignUp} disabled={!isEmailValid || passwordStrength < 2}>
        Sign Up
      </button>
      {showSuccessWindow && <SuccessWindow onClose={() => setShowSuccessWindow(false)} />}
    </div>
  );
}

export default App;
