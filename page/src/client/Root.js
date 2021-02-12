import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../shared/App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CookiesProvider } from 'react-cookie';

const theme = createMuiTheme({
	typography: {
		fontFamily: "inherit"
	}
})

const Root = () => (
	<BrowserRouter>
		<CookiesProvider>
			<MuiThemeProvider theme={theme}>
				<App />
			</MuiThemeProvider>
		</CookiesProvider>
	</BrowserRouter>
);

export default Root;