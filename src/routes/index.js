import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Home from '../pages/Home';
import Categorias from '../pages/Categorias';
import Receita from '../pages/Receita/index.js';
import Despesa from '../pages/Despesa';
import Consulta from '../pages/Consulta';


export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/register" component={SignUp}/>
            <Route exact path="/Home" component={Home} isPrivate/>
            <Route exact path="/categorias" component={Categorias} isPrivate/>
            <Route exact path="/receita" component={Receita} isPrivate/>
            <Route exact path="/despesas" component={Despesa} isPrivate/>
            <Route exact path="/consulta" component={Consulta} isPrivate/>
        </Switch>
    )
}