import React, { useState, createContext, useEffect, useContext } from "react";
import firebase from '../services/firebaseConnection';
import { AuthContext } from '../contexts/user';

export const ResumoContext = createContext({}); 

function ResumoProvider({children}){
    const { user } = useContext(AuthContext);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalDespesas, setTotalDespesas] = useState(0);
    const [calculando, setCalculando] = useState(true);
    const [uid, setUid] = useState('');
    

    useEffect(()=>{
        
        if(user){
            carregaReceitas(user.uid);
            carregaDespesas(user.uid);
        }
        
        //carregaDespesas();
          
    },[user]);

    function returnCurrentMonth(){
        const d = new Date();
        return d.getMonth() + 1;
    }
    async function atualizaGrafico(){
        carregaReceitas(user.uid);
        carregaDespesas(user.uid);
    }

    async function carregaReceitas(id){
        let pMes = returnCurrentMonth();
        let hoje = new Date();
        await firebase.firestore().collection('Receitas').where('mes', '==', pMes).where('ano', '==', hoje.getFullYear())
            .where('idUsuario', '==', id)
            .get()
            .then((snapshot)=>{
                const listaVazia = snapshot.size===0;
                
                if(!listaVazia){
                    let somaReceitas=0;
                    snapshot.forEach((doc)=>{
                        somaReceitas = somaReceitas + doc.data().valor;
                    })
                    setTotalReceitas(somaReceitas.toFixed(2));
                }else{
                    setTotalReceitas(0);
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    

        async function carregaDespesas(uid){
            let pMes = returnCurrentMonth();
            let hoje = new Date();
            //let mes = returnCurrentMonth();
            await firebase.firestore().collection('Despesas').where('mes', '==', pMes).where('ano', '==', hoje.getFullYear())
                .where('idUsuario', '==', uid)
                .get()
                .then((snapshot)=>{
                  const listaVazia = snapshot.size===0;
                  if(!listaVazia){
                    let somaDespesas = 0;
                    snapshot.forEach((doc)=>{
                        somaDespesas = somaDespesas + doc.data().valor;
                    });
                    setTotalDespesas(somaDespesas.toFixed(2));
                  }else{
                    setTotalDespesas(0);
                    //despesasCategoria(lista);
                  }
                  setCalculando(false); 
                })
                .catch((error)=>{
                  console.log(error);
                  setCalculando(false); 
                });
        
                //setLoad(false);
          }

    


    return(
        <ResumoContext.Provider value ={{totalReceitas, totalDespesas, calculando, atualizaGrafico}}>
            {children}
        </ResumoContext.Provider>
    )

}

export default ResumoProvider;