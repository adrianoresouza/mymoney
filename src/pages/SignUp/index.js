import React,{useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/user';

import './signup.css';
import logo from '../../assets/NicePng_save-money-png_10074776.png';


export default function SignUp() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const {signUp} = useContext(AuthContext);

    function handleSubmit(e){
        e.preventDefault();
        if(nome!=='' && email!=''&& senha!=''){
            signUp(email, senha, nome);
        }
    }

    return (
    <div className="container-center">
        
        <div className="login">
            <div className="login-area">
            <img src={logo} alt="Sistema Logo"/>
            </div>

            <form onSubmit={handleSubmit}>
            <h1>Cadastrar uma conta</h1>
            <input type="text" placeholder="Seu nome" value={nome} onChange={(e)=>{setNome(e.target.value)}}/>
            <input type="text" placeholder="email@email.com" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <input type="password" placeholder="***********" value={senha} onChange={(e)=>{setSenha(e.target.value)}}/>
            <button id="bt-signup" type="submit">Cadastrar</button>
            </form>
            <Link to="/">Já tem uma conta? Entre</Link>
        </div>
        
    </div>
    );
}