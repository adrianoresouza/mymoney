import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/user';
import { ResumoContext } from '../../contexts/resumo';
import firebase from '../../services/firebaseConnection';
import { MdStyle } from 'react-icons/md';
import Select from 'react-select';
import { format } from 'date-fns';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { Content, TableCategorias, BtEditar } from './styles';

export default function Consulta() {
    const { user } = useContext(AuthContext);
    const [mesSelecionado, setMesSelecionado] = useState(null);
    const [anoSelecionado, setAnoSelecionado] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [tipo, setTipo] = useState('');
    const [listaDespesas, setListaDespesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listaVazia, setListaVazia] = useState(true);

    const meses = [
        {value: '1', label:'Janeiro'},
        {value: '2', label:'Fevereiro'},
        {value: '3', label:'Março'},    
        {value: '4', label:'Abril'},
        {value:'5', label:'Maio'},
        {value:'6', label:'Junho'},
        {value:'7', label:'Julho'},
        {value:'8', label:'Agosto'},
        {value:'9', label:'Setembro'},
        {value:'10', label:'Outubro'},
        {value:'11', label:'Novembro'},
        {value:'12', label:'Dezembro'},
    ];
    
    
      

    useEffect(()=>{
        const d = new Date();
        let mes= d.getMonth() + 1;
        carregaTiposDespesas();
        //carregaDespesas();
        return()=>{

        }
    },[]);

    async function carregaTiposDespesas(){
        
        await firebase.firestore().collection('Categorias').where('tipo', '==', 'Despesa')
        .get()
        .then((snapshot)=>{
            
            const ListaVazia = snapshot.size===0;

            if(!ListaVazia){
                let lista = [];
                snapshot.forEach((doc)=>{
                    lista.push({
                        value: doc.id,
                        label: doc.data().nome,
                    })
                })
                
                setListaCategorias(lista);
                setTipoSelecionado(lista[0].nome);
            }
        })
        .catch((error)=>{console.log(error)})

    }

    async function carregaDespesas(e){
        e.preventDefault();
        setLoading(true);
        console.log(mesSelecionado.value.toString());
        console.log(tipoSelecionado.label.toString());
        console.log(anoSelecionado.toString());
        console.log(user.uid);
        if(mesSelecionado !== undefined && anoSelecionado !== undefined && tipoSelecionado !== undefined){
            await firebase.firestore().collection('Despesas').where('mes','==',parseInt(mesSelecionado.value)).orderBy('data', 'desc')
            .where('idUsuario', '==', user.uid)
            .where('tipo','==',tipoSelecionado.label.toString())
            .where('ano','==',parseInt(anoSelecionado))
            .get()
            .then((snapshot)=>{
                updateState(snapshot);
            })
            .catch((error)=>{console.log(error)});

            setLoading(false);
        }
        else{
            alert('Selecione corretamente os campos');
        }
    }

    async function updateState(snapshot){
        
        
        const lista = [];

        const ListaVazia = snapshot.size===0;
        setListaVazia(ListaVazia);
        
        if(!ListaVazia){
            
            snapshot.forEach((doc)=>{
                
                
                    lista.push({
                        id: doc.id,
                        descricao: doc.data().descricao,
                        tipo: doc.data().tipo,
                        valor: doc.data().valor,
                        data: doc.data().data,
                        dataFormatada: format(doc.data().data.toDate(), 'dd/MM/yyyy'),
                        fixa: doc.data().fixa
                    });
                

                
            })
            console.log(lista);
            //setListaCategorias(listaCategorias => [...listaCategorias, ...lista])
            setListaDespesas(lista);
            
        }

        if(ListaVazia){            
            setListaVazia(true);
        }

        setListaDespesas(lista);
    }

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          marginTop: '10px',
        }),
        control: (provided) => ({
          ...provided,
          marginBottom: "10px",
        })
      }

 return (
     <div style={{height: '100%'}}>
        <Header/>

        <Title name="Consultas de Despesa">
            <MdStyle size={25}/>
        </Title>

        <Content>
            <form className="form-cadastro" onSubmit={carregaDespesas}>
                <input className="input" placeholder="Informe o ano" type="text" value={anoSelecionado} onChange={(e)=>{setAnoSelecionado (e.target.value)}}/>
                <Select styles={customStyles} defaultValue={mesSelecionado} onChange={setMesSelecionado} options={meses} placeholder="Selecione um mês..."/>
                <Select defaultValue={tipoSelecionado} onChange={setTipoSelecionado} options={listaCategorias} placeholder="Selecione o tipo de despesa..."/>
                <button type="submit">Buscar</button>
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