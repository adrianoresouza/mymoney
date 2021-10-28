import React, { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { Content, TableCategorias } from './styles';
import { SketchPicker } from 'react-color';
import { MdStyle } from 'react-icons/md';

export default function Categorias() {
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('Receita');
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaVazia, setListaVazia] = useState(false);
    const [loading, setLoading] = useState(true);
    const [novo, setNovo] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categoria, setCategoria] = useState(null);
    const [corSelecionada, setCorSelecionada]= useState('#FFF');
    

    useEffect(()=>{
        carregaCategorias();
        return()=>{

        }
    },[]);

    async function carregaCategorias(){
        await firebase.firestore().collection('Categorias')
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
                await firebase.firestore().collection('Categorias')
            .add({
                nome: nome,
                tipo: tipo,
                cor: corSelecionada.hex,
            })
            .then(()=>{
                carregaCategorias();
                setNome('');
                setTipo('');
                setSaving(false);
            })
        }else{
            
            await firebase.firestore().collection('Categorias')
            .doc(categoria.id)
            .update({
                nome: nome,
                tipo: tipo,
                cor: corSelecionada.hex,
            })
            .then(()=>{
                carregaCategorias();
                setNome('');
                setTipo('');
                setCorSelecionada('#FFF');
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

    async function updateState(snapshot){
        const listaVazia = snapshot.size===0;

        if(!listaVazia){
            let lista = [];
            snapshot.forEach((doc)=>{
                console.log(doc.id);
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    tipo: doc.data().tipo,
                    cor: doc.data().cor,
                })
            })
            //setListaCategorias(listaCategorias => [...listaCategorias, ...lista])
            setListaCategorias(lista);
            setListaVazia(false);
        }else{
            setListaVazia(true);
        };
    }

    
    async function handleEditar(categoria){
        setNovo(false);
        setCategoria(categoria);
        setNome(categoria.nome);
        setTipo(categoria.tipo);
        setCorSelecionada(categoria.cor);
    }

    async function handleDelete(categoria){
        setLoading(true);
        await firebase.firestore().collection('Categorias')
        .doc(categoria.id).delete()
        .then(()=>{
            setNovo(true);
            setNome('');
            setCorSelecionada('#FFF');
            setCategoria(null);
            carregaCategorias();
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

       <Title name="Cadastro de Categorias">
            <MdStyle size={25}/>
        </Title>

       <Content className="content">
            <form className="form-cadastro" onSubmit={handleSubmit}>
                <label>Nome</label>
                <input type="text" value={nome} onChange={(e)=>{setNome(e.target.value)}}/>
                <label>Tipo</label> 
                <select value={tipo}  onChange={(e)=>setTipo(e.target.value)}>
                    <option key={'Receita'}>Receita</option>
                    <option key={'Despesa'}>Despesa</option>
                </select>
                <SketchPicker color={corSelecionada} onChangeComplete={(value)=>setCorSelecionada(value)}/>
                <button type="submit">Salvar</button>
            </form>

            {listaVazia ? (
                <></>
            ):(
                <TableCategorias>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaCategorias.map((categoria, index)=>{
                                return(
                                    <tr key={index}>
                                        <td data-label="Nome">{categoria.nome}</td>
                                        <td data-label="Tipo">{categoria.tipo}</td>
                                        <td data-label="#">
                                            <button onClick={()=>handleEditar(categoria)}>Editar</button>
                                            <button onClick={()=>handleDelete(categoria)}>Excluir</button>
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