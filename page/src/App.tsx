import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from './Main';
import './scss/main.scss';

// import library and set to use
const App = () => 
	<BrowserRouter>
		<Provider />
	</BrowserRouter>;

export default App;
