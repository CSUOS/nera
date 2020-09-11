import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../shared/App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        fontFamily: "inherit"
    }
})

const Root = () => (
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
);

export default Root;