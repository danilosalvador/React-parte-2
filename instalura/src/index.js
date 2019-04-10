import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Switch, Route, Redirect, matchPath} from 'react-router-dom';

function verificaAutenticacao(nextState, replace) { 

    const match = matchPath('/timeline', {
        path: nextState.match.url,
        exact: true
    })  

    let valida = false
    
    if (match !== null) {
        valida = match.isExact
    }

    if (valida && localStorage.getItem('auth-token') === null) { 
        return <Redirect to="/?msg=você precisa logar"/>
    } 
    else if (!valida && localStorage.getItem('auth-token') != null) {       
        const matchEsp = matchPath(nextState.location.pathname, {
            path: '/timeline/:login',
            exact: true,
            strict: false
          })
          if (matchEsp !== null && matchEsp.isExact) {  
            return <App login={matchEsp.params.login} />
        }
    } 

    return <App/>
}

ReactDOM.render(
    (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/timeline/:login?" render={verificaAutenticacao}/>
                <Route path='/logout' component={Logout}/>
            </Switch>
        </BrowserRouter>), 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
