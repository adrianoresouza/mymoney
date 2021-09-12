import React, {useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/user';
import { Link } from 'react-router-dom';
import {GiReceiveMoney, GiPayMoney} from 'react-icons/gi';
import { FaChartLine } from 'react-icons/fa';
import {BsListCheck} from 'react-icons/bs';
import { ImExit } from 'react-icons/im';
import './header.css';

export default function Header() {
const { user, signOut } = useContext(AuthContext);


  function handleLogOut(){
    signOut();
  }

 return (
   <div className="sidebar">
    <div>
        <h2>Bem vindo</h2>
    </div>

    <Link to="/categorias">
      <BsListCheck size={25}/>
      Categorias</Link>
    <Link to="/receita">
      <GiReceiveMoney size={25}/>
      Receitas</Link>
    <Link to="/despesas">
      <GiPayMoney size={25}/>
      Despesas</Link>
    <Link to="/home">
      <FaChartLine size={25}/>
      Dashboard
    </Link>
    <a onClick={()=>handleLogOut()}>
      <ImExit size={25}/>
      Sair
    </a>
   </div>
 );
}