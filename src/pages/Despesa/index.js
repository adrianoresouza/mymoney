import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/user';
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

//import DatePicker from 'react-datepicker';//apagar

//import DatePicker from '@bit/lekanmedia.shared-ui.date-picker';
import DatePicker from 'react-date-picker'
import CurrencyInput from 'react-currency-input-field';


import Header from '../../components/Header';
import Title from '../../components/Title';

import { Content, TableCategorias, BtEditar } from './styles';
import { MdStyle } from 'react-icons/md';

export default function Despesa() {
    const { user } = useContext(AuthContext);
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState(0);
    const [data, setData] = useState(new Date());
    const [listaDespesas, setListaDespesas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaVazia, setListaVazia] = useState(false);
    const [loading, setLoading] = useState(true);
    const [novo, setNovo] = useState(true);
    const [saving, setSaving] = useState(false);
    const [despesa, setDespesa] = useState(null)

    useEffect(()=>{
        carregaDespesas();
        carregaCategorias();
        return()=>{

        }
    },[]);

    

    async function carregaDespesas(){
        console.log(user);
        await firebase.firestore().collection('Despesas').orderBy('data', 'desc')
        .where('idUsuario', '==', user.uid)
        .get()
        .then((snapshot)=>{
            updateState(snapshot);
        })
        .catch((error)=>{console.log(error)});

        setLoading(false);
    }

    async function handleSubmit(e){
        setSaving(true);
        e.preventDefault();
            if(novo){
                await firebase.firestore().collection('Despesas')
                .add({
                    descricao: descricao,
                    tipo: tipo,
                    valor: Number(valor.replace(',','.')),
                    data: data,
                    dataformatada: data.toLocaleDateString(),
                    mes: data.getMonth()+1,
                    ano: data.getFullYear(),
                    idUsuario: user.uid,
                })
                .then(()=>{
                    carregaDespesas();
                    setDescricao('');
                    setTipo('');
                    setValor(0);
                    setData('');
                    setSaving(false);
                })
                }else{
                    await firebase.firestore().collection('Despesas')
                    .doc(despesa.id)
                    .update({
                        descricao: descricao,
                        tipo: tipo,
                        valor: Number(valor.replace(',','.')),
                        data: data,
                        dataformatada: data.toLocaleDateString(),
                        mes: data.getMonth()+1,
                        ano: data.getFullYear(),
                    })
                    .then(()=>{
                        carregaDespesas();
                        setDescricao('');
                        setTipo('');
                        setValor(0);
                        setData('');
                        setLoading(false);
                        setNovo(true);
                    })
                    .catch((error)=>{
                        console.log(error);
                        setLoading(false);
                        setNovo(true);
                    })
                    setSaving(false);
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
                        id: doc.id,
                        nome: doc.data().nome,
                    })
                })
                setListaCategorias(lista);
                setTipo(lista[0].nome);
            }
        })
    }

    async function updateState(snapshot){
        const listaVazia = snapshot.size===0;

        if(!listaVazia){
            let lista = [];
            snapshot.forEach((doc)=>{
                console.log(doc.id);
                lista.push({
                    id: doc.id,
                    descricao: doc.data().descricao,
                    tipo: doc.data().tipo,
                    valor: doc.data().valor,
                    data: doc.data().data,
                    dataFormatada: format(doc.data().data.toDate(), 'dd/MM/yyyy'),
                })
            })
            //setListaCategorias(listaCategorias => [...listaCategorias, ...lista])
            setListaDespesas(lista);
            setListaVazia(false);
        }else{
            setListaVazia(true);
        };
    }

    
    async function handleEditar(despesa){
        console.log(despesa);
        setNovo(false);
        setDespesa(despesa);
        setDescricao(despesa.descricao);
        setTipo(despesa.tipo);
        setValor(despesa.valor);
        setData(new Date(despesa.data.toDate()));
    }

    async function handleDelete(despesa){
        setLoading(true);
        await firebase.firestore().collection('Despesas')
        .doc(despesa.id).delete()
        .then(()=>{
            setNovo(true);
            setDescricao('');
            setDespesa(null);
            carregaDespesas();
            //setLoading(false);
        })
        .catch((error)=>{
            console.log(error);
            setNovo(true);
            setLoading(false);
        })
        
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
                <input type="text" value={descricao} onChange={(e)=>{setDescricao(e.target.value)}}/>
                <label>Data</label> 
                <DatePicker value={data} onChange={setData} className="DatePicker" format="dd/MM/yyyy"/>
                <label>Categoria</label>
                <select value={tipo} onChange={(e)=>{setTipo(e.target.value)}}>
                    {listaCategorias.map((categ, index)=>{
                        return(
                            <option key={index}>{categ.nome}</option>
                        )
                    })}
                </select>
                <label>Valor (R$)</label>
                <CurrencyInput prefix="R$" decimalSeparator="," groupSeparator="." value={valor} onValueChange={(value)=>setValor(value)} />
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
