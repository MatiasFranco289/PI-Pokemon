import {createStore, applyMiddleware} from 'redux';
import rootReducer from "../reducer/index.js";
import thunk from 'redux-thunk';

//Creo la redux store usando el reducer que defini y aplico el middleware thunk que se encargara de mis cosas asincronas
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;