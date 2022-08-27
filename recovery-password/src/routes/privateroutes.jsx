import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'



import { Login } from '../components/Login/Login';
import { ListaCategories } from '../page/categories/categories';
import { CategoriesForm } from '../page/categoriesForms/categoriesForms';

// import { NewUser } from '../page/NewUser/NewUser';  Criar usuario pelo frontend


export default function PrivateRoute(){
    return(
        <Switch>
              <Route exact path="/" component={Login} />
              {/* <CustomRoute exact path="/newuser" component={NewUser} /> */}
              <Route isPrivate path="/categories/novo" component={CategoriesForm} />
              <Route isPrivate path="/categories/editar/:id" component={CategoriesForm} />
              <Route isPrivate path="/categories" component={ListaCategories} />
        </Switch>
    )
}