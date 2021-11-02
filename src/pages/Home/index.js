import React, {useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import { Pie } from 'react-chartjs-2';
import { AuthContext } from '../../contexts/user';

import {MdAssessment, MdNavigateBefore, MdNavigateNext} from 'react-icons/md';
import {GiReceiveMoney, GiPayMoney} from 'react-icons/gi';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { Content, Dados,Receitas, Despesas, Resumo, } from './styles.js';


export default function Home() {
  const { user, signOut } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const [mes, setMes] = useState(returnCurrentMonth());
  const [mesAtual, setMesAtual] = useState('');
  const [listaDespesas, setListaDespesas] = useState([]);
  const [listaReceitas, setListaReceitas] = useState([]);
  const [totalDespesas, setTotalDespesas] = useState('');
  const [totalReceitas, setTotalReceitas] = useState('');
  const [somaDespesas, setSomaDespesas] = useState(0);
  const [somaReceitas, setSomaReceitas] = useState(0);
  const [saldo, setSaldo] = useState('');
  const [despesasAgrupadas, setDespesasAgrupadas] = useState([]);
  const [existeReceitas, setExisteReceitas] = useState(false);
  const [existeDespesas, setExisteDespesas] = useState(false);
  

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];


  const data = {
    labels: despesasAgrupadas.map((e)=>{return e.categoria}),
    datasets: [
      {
        label: "First dataset",
        data: despesasAgrupadas.map((e)=>{return e.total}),
        fill: true,
        backgroundColor: despesasAgrupadas.map((e)=>{
          if(e.cor == null){
            return getRandomColor()
          }
          else{
            return e.cor
          }
        }),
        borderColor: "#cecece",
      },
      /*{
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774"
      }*/
    ]
  };

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 15)];
    }
    return color;
}

  useEffect(()=>{
    getMonth();
    
    carregaReceitas(mes);
    carregaDespesas(mes);
    
    setLoad(false);
    
  },[]);

  useEffect(()=>{
    const totalDespesas = somaDespesas;
    const totalReceitas = somaReceitas;
    let saldo = 0;
    saldo = totalReceitas-totalDespesas;
    setSaldo('R$'+saldo.toFixed(2));
  },[somaDespesas, somaReceitas])
  

  
  async function carregaDespesas(pMes){
    let ano = getYear();
    //let mes = returnCurrentMonth();
    await firebase.firestore().collection('Despesas').where('mes', '==', pMes).where('ano', '==', ano)
        .where('idUsuario', '==', user.uid)
        .get()
        .then((snapshot)=>{
          const listaVazia = snapshot.size===0;
          if(!listaVazia){
            
            let lista = [];
            let somaDespesas = 0;
            snapshot.forEach((doc)=>{
              
                lista.push({
                  id: doc.id,
                  ano: doc.data().ano,
                  data: doc.data().data,
                  tipo: doc.data().tipo,
                  dataformatada: doc.data().dataformatada,
                  descricao: doc.data().descricao,
                  valor: doc.data().valor,
                })
                somaDespesas = somaDespesas + doc.data().valor;
            });
            
            setListaDespesas(lista);
            setExisteDespesas(true);
            setSomaDespesas(somaDespesas);
            setTotalDespesas('R$'+somaDespesas.toFixed(2));
            despesasCategoria(lista);
              //setTotalDespesas('R$'+somaDespesas.replace(/\b0+/g, ''));
          }else{
            setListaDespesas([]);
            setExisteDespesas(false);
            setSomaDespesas(0);
            setTotalDespesas('R$'+0);
            //despesasCategoria(lista);
          }
        })
        .catch((error)=>{
          console.log(error);
          setLoad(false);
          setExisteDespesas(false);
        });

        //setLoad(false);
  }

  async function carregaReceitas(pMes){
    let ano = getYear();
    //let mes = returnCurrentMonth();
    await firebase.firestore().collection('Receitas').where('mes', '==', pMes).where('ano', '==', ano)
        .where('idUsuario', '==', user.uid)
        .get()
        .then((snapshot)=>{
          const listaVazia = snapshot.size===0;
          
          if(!listaVazia){
            
            let somaReceitas=0;
            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    ano: doc.data().ano,
                    data: doc.data().data,
                    dataformatada: doc.data().dataformatada,
                    descricao: doc.data().descricao,
                    valor: doc.data().valor,
                    
                })
                somaReceitas = somaReceitas + doc.data().valor;
            })
            
            setListaReceitas(lista);
            setExisteReceitas(true);
            setTotalReceitas('R$' + somaReceitas.toFixed(2));
            setSomaReceitas(somaReceitas);
          }else{
            setListaReceitas([]);
            setExisteReceitas(false);
            setSomaReceitas(0);
            setTotalReceitas('R$'+0);
          }
        })
        .catch((error)=>{
          console.log(error);
          setLoad(false);
          setExisteReceitas(false);
        });
  }

  

  function handleLogOut(){
    signOut();
  }

  function getMonth(){
    const d= new Date();
    setMesAtual(monthNames[d.getMonth()]);
  }

  function getYear(){
    const d = new Date();
    return d.getFullYear();
  }

  function returnCurrentMonth(){
    const d = new Date();
    return d.getMonth() + 1;
  }

  async function despesasCategoria(pLista){
    await firebase.firestore().collection('Categorias').where('tipo', '==', 'Despesa')
        .get()
        .then((snapshot)=>{
            
            const listaVazia = snapshot.size===0;

            if(!listaVazia){
                let lista = [];
                //insiro as informações das categorias em uma lista
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        cor: doc.data().cor
                    })
                });
                
                let listaAgrupada =[];
                lista.forEach((categoria) =>{
                  
                  let soma = 0;

                  var listaFiltrada = pLista.filter(despesa => despesa.tipo == categoria.nome);

                  listaFiltrada.forEach((obj)=>{
                    soma = soma + obj.valor;
                  });

                  if(soma>0){
                    listaAgrupada.push({
                      categoria: categoria.nome,
                      cor: categoria.cor,
                      total: soma,
                    })
                  }
                  
                });

                listaAgrupada = listaAgrupada.sort((a, b)=> b.total - a.total); 
                
                setDespesasAgrupadas(listaAgrupada);
            }else{
              setDespesasAgrupadas([]);
            }
        })
  }

  function handleChange(direcao){
    if(direcao ==="next"){
      let index = monthNames.findIndex(mes => mes === mesAtual);
      if(index === 11){
        return;
      }
      setMes(index+1);
      setMesAtual(monthNames[index+1]);
      carregaReceitas(index+2);
      carregaDespesas(index+2);
      
    }
    if(direcao==="before"){
      let index = monthNames.findIndex(mes => mes === mesAtual);
      if(index === 0){
        return;
      }
      setMes(index);
      setMesAtual(monthNames[index-1]);
      carregaReceitas(index);
      carregaDespesas(index);
      
    }
  }

 return (
  <div>
    
      <Header/>
      <Title name="Dashboard">
          <MdAssessment size={20}/>
      </Title>

      <Content>
        
        <div className="mes">
          <button onClick={()=>handleChange('before')}>
            <MdNavigateBefore size={30}/>
          </button>
          
          <h1>{mesAtual}</h1>

          <button onClick={()=>handleChange('next')}>
            <MdNavigateNext size={30}/>
          </button>
        </div>
          
        <Dados>
          <Resumo>
            <h3>Resumo</h3>

            <div className="receitas-despesas">
              <h4>Receitas</h4>
              <label>{totalReceitas}</label>
              <h4>Despesas</h4>
              <label>{totalDespesas}</label>
              
            </div>
            
            
            <div className="saldo">
              <h4>Saldo</h4>
              <label>{saldo}</label>
            </div>
            
          </Resumo>

          {existeDespesas ? (
            <Despesas>
              <h3>Despesas por Categorias</h3>
            <table>
              
                <thead>
                  <tr>
                    <th scope="col">
                      Nome
                    </th>
                    <th scope="col">
                      Total(R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                {despesasAgrupadas.map((item, index)=>{
                
                return(
                    <tr key={index}>
                        <td data-label="Nome">{item.categoria}</td>
                        <td data-label="Total(R$)">{item.total.toFixed(2)}</td>
                    </tr>
                )
              })}
                </tbody>
            </table>
            
          </Despesas>
          ) : (<> </>) }


          {existeReceitas ? (
            <Receitas>
              <h3>Receitas</h3>
            <table>
            
              <thead>
                <tr>
                  <th scope="col">
                    Descrição
                  </th>
                  <th scope="col">
                    Data
                  </th>
                  <th scope="col">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                
              {listaReceitas.map((item, index)=>{
               
                return(
                    <tr key={index}>
                        <td data-label="Descrição">{item.descricao}</td>
                        <td data-label="Data">{item.dataformatada}</td>
                        <td data-label="Valor(R$)">{item.valor}</td>
                    </tr>
                )
              })}
                
              </tbody>
            </table>
          </Receitas>
          ):(<></>)}
        <div className="chart">
          <Pie data={data}/>
        </div>
        </Dados>
        
        <Link className="fab-receita" to="/receita">
          <GiReceiveMoney size={30}/>
          </Link>

        <Link className="fab-despesa" to="/despesas">
          <GiPayMoney size={30}/>
        </Link>
      </Content>
   </div>
 );
}