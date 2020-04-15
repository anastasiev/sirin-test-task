import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store, { history } from './redux/store';
import { ConnectedRouter as Router } from 'react-router-redux';

const theme = createMuiTheme({});

ReactDOM.render(
    <Provider store = { store }>
        <ThemeProvider theme = { theme }>
            <Router history = { history }>
                <App />
            </Router>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
