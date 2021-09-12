import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/user';
import { redirect } from 'statuses';

export default function RouteWrapper({
    component: Component, //componente que irá renderizar
    isPrivate,
    ...rest //repassa o restante
}){

    const { signed, loading } = useContext(AuthContext);
    
    

    if(loading){
        return(
            <div>
                <h1>Carregando...</h1>
            </div>
        )
    }
    

    if(!signed && isPrivate)
    {
        return <Redirect to="/"/>
    }

    if(signed && !isPrivate){
        return <Redirect to="/home"/>
    }

    return(
        <Route
            {...rest}
            //render é oq será renderizado.. no caso o componente passado lá em cima
            render={ props => (
                <Component {...props} />
            )}
        />
    )
}

