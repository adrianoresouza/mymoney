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

export default function Receita() {
    const { user } = useContext(AuthContext);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('Receita');
    const [valor, setValor] = useState(0.0);
    const [data, setData] = useState(new Date());
    const [listaReceitas, setListaReceitas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaVazia, setListaVazia] = useState(false);
    const [loading, setLoading] = useState(true);
    const [novo, setNovo] = useState(true);
    const [saving, setSaving] = useState(false);
    const [receita, setReceita] = useState(null)

    useEffect(()=>{
        carregaReceitas();
        carregaCategorias();
        return()=>{

        }
    },[]);

    

    async function carregaReceitas(){
        await firebase.firestore().collection('Receitas').where('idUsuario', '==', user.uid)
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
                await firebase.firestore().collection('Receitas').orderBy('data', 'desc')
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
                carregaReceitas();
                setDescricao('');
                setTipo('');
                setValor(0);
                setData('');
                setSaving(false);
            })
        }else{
            await firebase.firestore().collection('Receitas')
            .doc(receita.id)
            .update({
                descricao: descricao,
                tipo: tipo,
                valor: Number(valor.replace(',','.')),
                data: data,
                dataformatada: new Date(data),
                mes: data.getMonth()+1,
                ano: data.getFullYear(),
            })
            .then(()=>{
                carregaReceitas();
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
        await firebase.firestore().collection('Categorias').where('tipo', '==', 'Receita')
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
            setListaReceitas(lista);
            setListaVazia(false);
        }else{
            setListaVazia(true);
        };
    }

    
    async function handleEditar(receita){
        console.log(receita);
        setNovo(false);
        setReceita(receita);
        setDescricao(receita.descricao);
        setTipo(receita.tipo);
        setValor(receita.valor);
        setData(new Date(receita.data.toDate()));
    }

    async function handleDelete(categoria){
        setLoading(true);
        await firebase.firestore().collection('Receitas')
        .doc(categoria.id).delete()
        .then(()=>{
            setNovo(true);
            setDescricao('');
            setReceita(null);
            carregaReceitas();
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

       <Title name="Incluir Receita">
            <MdStyle size={25}/>
        </Title>

       <Content>
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
                            {listaReceitas.map((receita, index)=>{
                                return(
                                    <tr key={index}>
                                        <td data-label="Descrição">{receita.descricao}</td>
                                        <td data-label="Data">{receita.dataFormatada}</td>
                                        <td data-label="Categoria">{receita.tipo}</td>
                                        <td data-label="Valor(R$)">{receita.valor}</td>
                                        <td data-label="">
                                            <button onClick={()=>handleEditar(receita)}>Editar</button>
                                            <button onClick={()=>handleDelete(receita)}>Excluir</button>
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
