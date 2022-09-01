import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'



import { enviarEmail } from '../components/Login/login';
import { alterPassawordForms } from '../page/categoriesForms/alterPassawordForms';

// import { NewUser } from '../page/NewUser/NewUser';  Criar usuario pelo frontend


export default function PrivateRoute(){
    return(
        <Switch>
              <Route exact path="/" component={enviarEmail} />
              {/* <CustomRoute exact path="/newuser" component={NewUser} /> */}
              <Route  path="/categories/novo" component={alterPassawordForms} />
             
        </Switch>
    )
}