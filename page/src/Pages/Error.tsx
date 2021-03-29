import React from 'react';

import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Error = () => {
	return (
		<Grid id="error-page">
			<Grid className="error-con">
				<Grid className="error-head">
					<img src="./img/logo_new.png" alt="logo" />
					<h2>404 Error</h2>
					<h4>We can&apos;t seem to find the page you&apos;re looking for</h4>
				</Grid>
				<Grid className="btn-con">
					<Link to="/main"><Button color="primary" variant="contained">Back To Main</Button></Link>
				</Grid>
			</Grid>
		</Grid>
	);
}
export default Error;
