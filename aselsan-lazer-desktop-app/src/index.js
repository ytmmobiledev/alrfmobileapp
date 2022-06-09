

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.less'
import "antd/dist/antd.min.css";
import 'reactjs-bottom-navigation/dist/index.css'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css';
//import 'swiper/modules/navigation/navigation.scss';


import {createTheme, ThemeProvider} from "@mui/material";

import { HashRouter as Router, Route } from 'react-router-dom'

import Home from "./App"
import Tabs from "./pages/tabs";
import SelectDevice from "./pages/selectDevice";
import Loading from "./componenets/Loading";
import SetModal from "./componenets/SetModal";
import Compass from "./pages/compass";
import Slide from "./pages/slide";
import MoreInfo from "./pages/moreInfo";


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
                <Route path="/select-device" component={SelectDevice} />
                <Route path="/compass" component={Compass} />
                <Route path="/slide" component={Slide} />
                <Route path="/more-info" component={MoreInfo} />
            </main>
        </ThemeProvider>
        <Loading/>
        <SetModal/>
    </Router>, 
    document.getElementById("root")
    
)
