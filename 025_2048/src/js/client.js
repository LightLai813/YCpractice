import React from "react";
import ReactDom from "react-dom";

import style from "../css/style.less";

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import numberReducer from './reducers/numberReducer'
import Index from "./pages/Index.jsx"

let store = createStore(numberReducer);
const app = document.getElementById('app');

ReactDom.render(
	<Provider store={store}>
        <Index />
	</Provider>,
app);