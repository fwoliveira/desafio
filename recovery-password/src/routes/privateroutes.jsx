import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { enviarEmail } from '../components/recovery/recovery';
import { alterPassawordForms } from '../page/categoriesForms/alterPassawordForms';
export default function PrivateRoute(){
    return(
        <Switch>
              <Route exact path="/" component={enviarEmail} />
              <Route  path="/recoverypassword" component={alterPassawordForms} />
        </Switch>
    )
}