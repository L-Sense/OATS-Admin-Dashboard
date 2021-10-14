import { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import oatslogo from '../../assets/oatslogo.png';
import useStyles from './theme';
import { useHistory } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';



export default function Login() {
	const classes = useStyles();
	const [email, setEmail] =  useState("");
	const [password, setPassword] = useState("");
	const history = useHistory()
	const [loading, setLoading] = useState(false);

	async function handleLogin(email, password, history){
		setLoading(true)
		const result = await authenticationService.login(email, password, history);
		if (!result){
			alert("login failed");
		} 
		setLoading(false)
		history.push('/');
	}

	useEffect(()=>{
		authenticationService.authorize()
		.then( res => {
			history.push('/');
		})
		.catch( res => {
			console.log("user not logged in");
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Container component="main" maxWidth="xs">
		<CssBaseline />
		<div className={classes.paper}>
			<Avatar className={classes.avatar} variant="circular" alt="OATS icon" src={oatslogo}/>
			<Typography component="h1" variant="h5">
			Welcome to OATS
			</Typography>
			<form className={classes.form} noValidate>
			<TextField
				variant="outlined"
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				name="email"
				autoFocus
				inputProps={{
					autoComplete: 'new-password',
					form: {
					autoComplete: 'off',
					},
				}}
				onChange={e => setEmail(e.target.value)}
			/>
			<TextField
				variant="outlined"
				margin="normal"
				required
				fullWidth
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="new-password"
				onChange={e => setPassword(e.target.value)}
			/>
			<div style={{display: 'flex', justifyContent: 'center'}}>
			{loading && <CircularProgress sx={{ marginX: 'auto' }}/>}
			</div>
			<Button
				fullWidth
				variant="contained"
				color="primary"
				className={classes.submit}
				onClick={ () => handleLogin(email, password, history) }
				disabled={loading}
			>
				Login
			</Button>
			</form>
		</div>
		<Box mt={8}>
			<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © L-Sense 2021 .'}
			</Typography>
		</Box>
		</Container>
	);
}