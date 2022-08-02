import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import EmailIcon from '@mui/icons-material/Email';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Typography from '@mui/material/Typography';
import Auth from '../utils/auth';





const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <Typography variant="h2">Sign Up</Typography>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (


              <form onSubmit={handleFormSubmit}>
                <Box>
                  <Grid container spacing={1} direction="column" alignItems="center">
                    <Grid item xs={4}>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-username"
                          className="form-input"
                          placeholder="Your username"
                          name="username"
                          type="text"
                          value={formState.name}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <PersonOutlineIcon></PersonOutlineIcon>
                            </InputAdornment>
                          }
                          label="username"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">

                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                          className="form-input"
                          placeholder="Your email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <EmailIcon></EmailIcon>
                            </InputAdornment>
                          }
                          label="Email"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                          className="form-input"
                          placeholder="******"
                          name="password"
                          type="password"
                          value={formState.password}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        className="btn btn-block btn-primary"
                        style={{ cursor: 'pointer' }}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
