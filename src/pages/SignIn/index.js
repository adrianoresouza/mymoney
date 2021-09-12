import React,{useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/user';

import './style.css';
import logo from '../../assets/NicePng_save-money-png_10074776.png';



export default function SignIn() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    if(email!=''&& senha!=''){
        signIn(email, senha);
    }
}
  

 return (
   <div className="container-center">
     
      <div className="login-signin">
        <div className="login-area">
          <img src={logo} alt="Sistema Logo"/>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="***********" value={senha} onChange={(e)=>setSenha(e.target.value)}/>
          <button id="bt-signin" type="submit">Acessar</button>
        </form>
        <Link to="/register">Criar uma conta</Link>
      </div>
     
   </div>
  );
}