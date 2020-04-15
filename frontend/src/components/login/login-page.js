import React, {useState} from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button
} from "@material-ui/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';

import {login, signup} from "../../redux/api";
import {authSuccess} from "../../redux/actions";
import {deepOrange} from "@material-ui/core/colors";

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: '#ff8a65',
    '&:hover': {
      backgroundColor: '#ff7043'
    }
  },
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#ff8a65',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#ff8a65',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#ff8a65',
      },
    },
  },
})(TextField);

const LoginPage = ({authSuccess}) => {
  const [isSignup, switchForm] = useState(false);
  const [emailValue, setEmail] = useState('');
  const [passwordValue, setPassword] = useState('');
  const [confirmValue, setConfirmPassword] = useState('');
  const classes = useStyles();
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirm: ''
  });
  const auth = async () => {
      if (emailValue === '') {
        setErrors({...errors, email: 'Required'});
        return;
      } else {
        setErrors((errors) => ({...errors, email: ''}) );
      }
      if (passwordValue === '') {
        setErrors((errors) => ({...errors, password: 'Required'}) );
        return;
      } else {
        setErrors((errors) => ({...errors, password: ''}) );
      }
      if (confirmValue === '' && isSignup) {
        setErrors((errors) => ({...errors, confirm: 'Required'}) );
        return;
      } else {
        setErrors((errors) => ({...errors, confirm: ''}) );
      }
      if (isSignup && (passwordValue !== confirmValue)) {
        setErrors((errors) => ({...errors, confirm: 'Passwords are not the same'}) );
        return;
      } else {
        setErrors((errors) => ({...errors, confirm: ''}) );
      }
      if (!validateEmail(emailValue)) {
        setErrors((errors) => ({...errors, email: 'Invalid email'}) );
        return;
      } else {
        setErrors((errors) => ({...errors, email: ''}) );
      }
      const api = isSignup ? signup : login;
      try {
        const responseData = await api(emailValue, passwordValue);
        authSuccess(responseData);
      } catch (e) {
        setErrors((errors) => ({...errors, password: 'Invalid credentials'}) );
      }
  };
  const {email, password, confirm} = errors;
  return(
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        component={Paper}
        width="400px"
        height="400px"
        elevation={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        marginTop="100px"
        padding="25px"
      >
        <Box paddingBottom="20px">
          <Typography variant="h6">
            Welcome on Sirin test task site
          </Typography>
        </Box>
        <Box paddingBottom="20px" width="100%">
          <CssTextField
            fullWidth
            helperText={email}
            error={Boolean(email)}
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box paddingBottom="20px" width="100%">
          <CssTextField
            fullWidth
            type="password"
            helperText={password}
            error={Boolean(password)}
            label="Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        {
          isSignup && (
            <Box paddingBottom="20px" width="100%">
              <CssTextField
                fullWidth
                label="Confirm password"
                type="password"
                helperText={confirm}
                error={Boolean(confirm)}
                variant="outlined"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Box>
          )
        }
        <Box display="flex" alignItems="center" width="100%" justifyContent="center" marginBottom="25px">
          {isSignup ?
            <Typography variant="overline" display="block">Have account?</Typography> :
            <Typography variant="overline" display="block">Do not have account?</Typography>
          }
          <Box paddingLeft="10px">
            <Button
              variant="outlined"
              onClick={()=>switchForm(!isSignup)}
            >
              { isSignup ? 'Login': 'Signup' }
            </Button>
          </Box>
        </Box>

        <Box
          component={Button}
          width="100%"
          variant="contained" color="primary"
          onClick={auth}
          className={classes.button}
        >
          { isSignup ? 'Signup': 'Login' }
        </Box>

      </Box>
    </Box>
  )
};

export default connect(null, { authSuccess })(LoginPage);