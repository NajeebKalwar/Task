import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const LOGIN_USER_MUTATION = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
      usertype
      message
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use Apollo's useMutation hook for login
  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER_MUTATION);

  const handleLogin = async () => {
    setIsLoading(true);

    // Basic form validation
    let hasError = false;
    const newError = { email: '', password: '', message: '' };

    if (!email) {
      newError.email = "Email can't be empty";
      hasError = true;
    }
    if (!password) {
      newError.password = "Password can't be empty";
      hasError = true;
    }
    console.log("working");

    setErrors(newError);

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      //   console.log( response);

      // Call the login mutation
      const response = await loginUser({
        variables: { email, password },
      });

      console.log(response);
      // Check for successful login
      if (response.data) {
        if (response.data.loginUser.usertype === "Admin") {
          // console.log('Login successful:', response.data.loginUser.usertype);
          navigate('/home');
        } else {
          navigate('/userhome');
        }
      } else {
        setErrors(response.data.loginUser.message);
      }

    } catch (err) {
      newError.message = err.message;
      setErrors(newError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input
          type="text"
          placeholder="Email address"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={styles.errorText}>{errors.password}</p>}

        <div style={styles.checkboxContainer}>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" style={styles.label}>Remember me</label>
          <a href="/" style={styles.forgotPassword}>Forgot password?</a>
        </div>

        {errors.message && <p style={styles.errorText}>{errors.message}</p>}

        <button onClick={handleLogin} style={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Sign In'}
        </button>

        <p style={styles.text}>
          Not a member? <a href="/register" style={styles.link}>Register</a>
        </p>
        <p style={styles.text}>or sign up with:</p>
        <div style={styles.socialIcons}>
          <span style={styles.icon}></span>
          <span style={styles.icon}></span>
          <span style={styles.icon}></span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '90%',
    maxWidth: '400px',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  errorText: {
    color: 'red',
    fontSize: '0.85em',
    textAlign: 'left',
    marginBottom: '8px',
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0',
  },
  label: {
    fontSize: '0.9em',
  },
  forgotPassword: {
    fontSize: '0.9em',
    color: '#007bff',
    textDecoration: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  text: {
    marginTop: '10px',
    fontSize: '0.9em',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  icon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#ccc',
    borderRadius: '50%',
    margin: '0 5px',
  },
};

export default Login;
