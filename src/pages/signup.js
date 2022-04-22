import {
  Button,
  Card,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/shared/Seo";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { HighlightOff, CheckCircleOutline } from "@material-ui/icons";
import { AuthContext } from "../auth";
import { useHistory } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";
import { useApolloClient } from "@apollo/client";
import { useForm } from "react-hook-form";



function SignUpPage() {
  const client = useApolloClient();
  const classes = useSignUpPageStyles();
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = React.useState('');
  const { register, handleSubmit, formState, errors } = useForm({
    mode: "onChange",
  });


  const onSubmit = async (data) => {
    // console.log({ data });
    try {
      setError("");
      await signUpWithEmailAndPassword(data);
      history.push("/");
    } catch (error) {
      console.error("Error signing up", error);
      // setError(error.message);
      handleError(error);
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword)
  }

  const handleError = (error) => {
    if (error.message.includes("users_username_key")) {
      setError("Username already taken");
    } else if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  async function validateUsername(username) {
    const variables = { username };
    const response = await client.query({
      query: CHECK_IF_USERNAME_TAKEN,
      variables,
    });
    const isUsernameValid = response.data.users.length === 0;
    return isUsernameValid;
  }

  const errorIcon = (
    <InputAdornment>
      <HighlightOff style={{ color: "red", height: 30, width: 30 }} />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline style={{ color: "#ccc", height: 30, width: 30 }} />
    </InputAdornment>
  );

  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <div className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email', {
                  'required': true,
                  validate: (input) => isEmail(input),
                })}
                name="email"
                InputProps={{
                  endAdornment: errors && errors?.email
                    ? errorIcon
                    : formState.touched?.email && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                {...register('name', {
                  'required': true,
                  minLength: 5,
                  maxLength: 20,
                })}
                fullWidth
                name="name"
                // onChange={handleChange}
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
                InputProps={{
                  endAdornment: errors?.name
                    ? errorIcon
                    : formState.touched?.name && validIcon,
                }}
              />
              <TextField
                fullWidth
                name="username"
                // onChange={handleChange}
                variant="filled"
                label="username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                InputProps={{
                  endAdornment: errors?.username
                    ? errorIcon
                    : formState.touched?.username && validIcon,
                }}
                {...register('username', {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  validate: async (input) => await validateUsername(input),
                  // accept only lowercase/uppercase letters, numbers, periods and underscores
                  pattern: /^[a-zA-Z0-9_.]*$/,
                })}
              />
              <TextField
                fullWidth
                {...register('password', {
                  required: true,
                  minLength: 6,
                })}
                InputProps={{
                  startAdornment: errors?.password
                    ? errorIcon
                    : formState.touched?.password && validIcon,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                name="password"
                // onChange={handleChange}
                variant="filled"
                label="password"
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
              />
              <Button
                style={{ backgroundColor: "#764bbb" }}
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button style={{ color: "#764bbb" }} color="primary" className={classes.loginButton}>
                Log In
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  )
}

export const AuthError = ({ error }) => {
  return (
    Boolean(error) && (
      <Typography
        align="center"
        gutterBottom
        variant="body2"
        style={{ color: "red" }}
      >
        {error}
      </Typography>
    )
  );
}

export default SignUpPage;
