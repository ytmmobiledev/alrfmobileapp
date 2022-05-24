import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.less'
import "antd/dist/antd.min.css";
import 'reactjs-bottom-navigation/dist/index.css'
import {createTheme, ThemeProvider} from "@mui/material";

import { HashRouter as Router, Route } from 'react-router-dom'

import Home from "./App"
import Tabs from "./pages/tabs";
import Colors from "./constants/Colors";

const theme = createTheme({
    palette: {
        background: {
            paper: '#fff',
        },
        text: {
            primary: 'red',
            secondary: '#46505A',
        },
        action: {
            active: '#001E3C',
        }
    },
});

ReactDOM.render(
    <Router>
        <ThemeProvider theme={theme}>
            <main>
                <Route exact path="/" component={Home} />
                <Route path="/tabs" component={Tabs} />
            </main>
        </ThemeProvider>
    </Router>, 
    document.getElementById("root")
    
)
