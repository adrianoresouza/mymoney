import React, {useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/user';
import { ResumoContext } from '../../contexts/resumo';
import { Link } from 'react-router-dom';
import {GiReceiveMoney, GiPayMoney} from 'react-icons/gi';
import { FaChartLine } from 'react-icons/fa';
import {BsListCheck} from 'react-icons/bs';
import { ImExit } from 'react-icons/im';

import { VictoryChart ,VictoryBar, VictoryLabel ,VictoryTheme, VictoryAxis, VictoryContainer } from 'victory';

import './header.css';

export default function Header() {
const { user, signOut } = useContext(AuthContext);
const { totalReceitas, totalDespesas, calculando } = useContext(ResumoContext);



  function handleLogOut(){
    signOut();
  }

  const options ={
    options: {
      plugins:{
        legend: {
          position: 'bottom',
          display: true,
        },
      },
      
      scales: {
        x: {
          beginAtZero: true
        }
      },
      
    },
  }

  console.log(totalReceitas);
  console.log(totalDespesas);

  const data = [
    {tipo: 'Receita', valor: Number.parseFloat(totalReceitas)},
    {tipo: 'Despesa', valor: Number.parseFloat(totalDespesas)},
    
  ];

 return (
   <div className="sidebar">
    <div className="boasvindas">
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
    
    <div className="chart-header">

      <VictoryBar
          style={{ data: { fill: ({datum}) => datum.tipo === "Receita" ? "#73B0E3": "#c43a31" } }}
          domainPadding={{ x:80} }
          height={400}
          width={400}
          data={data}
          barRatio={0.9}
          
          // data accessor for x values
          x="tipo"
          // data accessor for y values
          y="valor"
          labels={[totalReceitas, totalDespesas]}
          labelComponent={
            <VictoryLabel  
              textAnchor="middle"
              style={[
                { fontSize: 25 },
                { fontSize: 25 }
              ]}
            
            />
          }
      />

      
    </div>
   </div>
 );
}