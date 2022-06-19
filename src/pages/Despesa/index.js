import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/user';
import { ResumoContext } from '../../contexts/resumo';
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

//import DatePicker from 'react-datepicker';//apagar

//import DatePicker from '@bit/lekanmedia.shared-ui.date-picker';
import DatePicker from 'react-date-picker'
import CurrencyInput from 'react-currency-input-field';
import Select from 'react-select';


import Header from '../../components/Header';
import Title from '../../components/Title';

import { Content, TableCategorias } from './styles';
import { MdStyle } from 'react-icons/md';


export default function Despesa() {
    const { user } = useContext(AuthContext);
    const { atualizaGrafico } = useContext(ResumoContext);
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState(null);
    const [valor, setValor] = useState(0);
    const [data, setData] = useState(new Date());
    const [listaDespesas, setListaDespesas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaVazia, setListaVazia] = useState(false);    
    const [novo, setNovo] = useState(true);    
    const [despesa, setDespesa] = useState(null)
    const [contaPaga, setContaPaga] = useState(true);

    useEffect(()=>{
        const d = new Date();
        let mes= d.getMonth() + 1;
        carregaDespesas(mes);
        carregaCategorias();
        return()=>{

        }
    },[]);

    useEffect(()=>{
        if(data!==null){
            let mes = data.getMonth()+1;
            carregaDespesas(mes);
        }
    },[data])

    async function carregaDespesas(pMes){

        const despesasFixasSnapshot = await firebase.firestore().collection('Despesas').where('fixa','==', true).orderBy('data', 'desc')
        .where('idUsuario', '==', user.uid)
        .get();

        await firebase.firestore().collection('Despesas').where('mes','==',pMes).orderBy('data', 'desc')
        .where('idUsuario', '==', user.uid)
        .get()
        .then((snapshot)=>{
            updateState(snapshot, despesasFixasSnapshot);
        })
        .catch((error)=>{console.log(error)});
    }

    async function handleSubmit(e){        
        e.preventDefault();
            if(novo){
                await firebase.firestore().collection('Despesas')
                .add({
                    descricao: descricao,
                    tipo: tipo.value,
                    valor: Number(valor.toString().replace(',','.')),
                    data: data,
                    dataformatada: data.toLocaleDateString(),
                    mes: data.getMonth()+1,
                    ano: data.getFullYear(),
                    idUsuario: user.uid,
                    contaPaga: contaPaga
                })
                .then(()=>{
                    carregaDespesas(data.getMonth()+1);
                    atualizaGrafico();
                    setDescricao('');
                    setTipo('');
                    setValor(0);
                    setContaPaga(false);
                    //setData(d);
                    
                })
            }else{
                await firebase.firestore().collection('Despesas')   
                .doc(despesa.id)
                .update({
                    descricao: descricao,
                    tipo: tipo.value,
                    valor: Number(valor.toString().replace(',','.')),
                    data: data,
                    dataformatada: data.toLocaleDateString(),
                    mes: data.getMonth()+1,
                    ano: data.getFullYear(),
                    contaPaga: contaPaga
                })
                .then(()=>{
                    carregaDespesas(data.getMonth()+1);
                    atualizaGrafico();
                    setDescricao('');
                    setTipo('');
                    setValor(0);
                    setContaPaga(true);              
                    setNovo(true);
                })
                .catch((error)=>{
                    console.log(error);                    
                    setNovo(true);
                })                
            }
        
    }

    async function carregaCategorias(){
        await firebase.firestore().collection('Categorias').where('tipo', '==', 'Despesa')
        .get()
        .then((snapshot)=>{
            
            const listaVazia = snapshot.size===0;

            if(!listaVazia){
                let lista = [];
                snapshot.forEach((doc)=>{
                    lista.push({
                        value: doc.data().nome,
                        label: doc.data().nome,
                    })
                })
                setListaCategorias(lista);
                setTipo(lista[0].nome);
            }
        })
    }

    async function updateState(snapshot, snapshotFixas){
        
        
        const lista = [];

        const listaVazia = snapshot.size===0;        
        
        if(!listaVazia){
            
            snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        descricao: doc.data().descricao,
                        tipo: doc.data().tipo,
                        valor: doc.data().valor,
                        data: doc.data().data,
                        dataFormatada: format(doc.data().data.toDate(), 'dd/MM/yyyy'),
                        contaPaga: doc.data()?.contaPaga
                    });               
            })
            //setListaCategorias(listaCategorias => [...listaCategorias, ...lista])
            setListaDespesas(lista);
            setListaVazia(false);

        }

        if(listaVazia){            
            setListaVazia(true);
        }
        

       
        setListaDespesas(lista);
    }

    
    async function handleEditar(despesa){
        console.log(despesa.tipo);
        setNovo(false);
        setDespesa(despesa);
        setDescricao(despesa.descricao);
        let tipoSelecionado ={
            value: despesa.tipo,
            label: despesa.tipo,
        }
        setTipo(tipoSelecionado);
        setValor(despesa.valor);
        setData(new Date(despesa.data.toDate()));
        setContaPaga(despesa?.contaPaga);
        window.scrollTo(0,0);
    }

    async function handleDelete(despesa){        
        await firebase.firestore().collection('Despesas')
        .doc(despesa.id).delete()
        .then(()=>{
            setNovo(true);
            setDescricao('');
            setDespesa(null);
            carregaDespesas(data.getMonth()+1);
            //setLoading(false);
        })
        .catch((error)=>{
            console.log(error);
            setNovo(true);            
        })
        
    };

    const handleCheckChange = () => {
        setContaPaga(!contaPaga);
    }
    
 return (
   <div>
       <Header/>

       <Title name="Incluir Despesa">
            <MdStyle size={25}/>
        </Title>

       <Content className="content">
            <form className="form-cadastro" onSubmit={handleSubmit}>
                <label>Descrição</label>
                <input className="input" type="text" value={descricao} onChange={(e)=>{setDescricao(e.target.value)}}/>
                <label>Data</label> 
                <DatePicker value={data} onChange={setData} className="DatePicker" format="dd/MM/yyyy"/>
                <label>Categoria</label>
                <Select value={tipo} onChange={setTipo} options={listaCategorias}/>
                    
                <label>Valor (R$)</label>
                <CurrencyInput className="input" prefix="R$" decimalSeparator="," groupSeparator="." value={valor} onValueChange={(value)=>setValor(value)} />
                <label id="checkbox">
                    <input type="checkbox" checked={contaPaga} onChange={handleCheckChange}/>
                    Pago?
                </label>
                
                <button type="submit">Salvar</button>
            </form>

            {listaVazia ? (
                <></>
            ):(
                <TableCategorias>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Descrição</th>
                                <th scope="col">Data</th>
                                <th scope="col">Categoria</th>
                                <th scope="col">Valor (R$)</th>
                                <th scope="col">Paga</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaDespesas.map((despesa, index)=>{
                                return(
                                    <tr key={index}>
                                        <td data-label="Descrição">{despesa.descricao}</td>
                                        <td data-label="Data">{despesa.dataFormatada}</td>
                                        <td data-label="Categoria">{despesa.tipo}</td>
                                        <td data-label="Valor(R$)">{despesa.valor}</td>
                                        <td data-label="Paga">{despesa.contaPaga ? 'Sim' : 'Não'}</td>
                                        <td data-label="">
                                            <button onClick={()=>handleEditar(despesa)}>Editar</button>
                                            <button onClick={()=>handleDelete(despesa)}>Excluir</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>    
                    </table>
                </TableCategorias>
                
            )}
            
       </Content>

   </div>
 );
}
