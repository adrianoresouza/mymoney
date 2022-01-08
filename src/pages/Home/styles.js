import styled from 'styled-components';

export const SuperDiv = styled.div`

    height: -webkit-fill-available;
    min-height: -webkit-fill-available;
`;

export const Content = styled.div`
    min-height: -webkit-fill-available;
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 500px;
    margin-left: 210px;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 5px;
    background-color: #cecece;
    padding: .8em;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    
    .mes{
        margin: 15px auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;


        button{
            border: 2px solid #F57B3F;
            background-color: #FFF;
            outline: 0;
            margin: -2px 10px;
            transition: 0.2s;
        }

        button:hover{
            background-color: #F57B3F;

            svg{
                color: #FFF;
            }
        }   
    }

    

    h1{
        margin: 0 auto;
        text-align: center;
    }

    input{
        padding: 5px;
        margin: 10px 0;
    }

    select{
        padding: 5px;
        margin: 10px 0;
    }

    button[type=submit]{
        width: 150px;
        margin: 10px auto;
        background-color: #F57B3F;
        transition: 0.3s;
    }

    button[type=submit]:hover{
        background-color: #FFF;
        color: #F57B3F;
    }

    

    .fab-receita{
        position:fixed;
        width:60px;
        height:60px;
        bottom:120px;
        right:40px;
        background-color:#7CCD7C;
        color:#FFF;
        border-radius:50px;
        text-align:center;
        box-shadow: 2px 2px 3px #999;

        svg{
            margin: 12px auto;
        }

        @media screen and (max-width: 700px){
            bottom:200px;
            right:40px;
        }
    }

    .fab-despesa{
        position:fixed;
        width:60px;
        height:60px;
        bottom:40px;
        right:40px;
        background-color:#FF4500;
        color:#FFF;
        border-radius:50px;
        text-align:center;
        box-shadow: 2px 2px 3px #999;

        svg{
            margin: 12px auto;
        }

        

        @media screen and (max-width: 700px){
            bottom: 100px;
            right: 40px;
        }
    }

    

    @media screen and (max-width: 700px){
        min-height: -webkit-fill-available;
        margin-left: 10px;
        flex-direction: column;
        justify-content: flex-start;
    }
`;



export const Dados = styled.div`
    margin: 15px auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    @media screen and (max-width: 700px){
        width: 95%;
        margin-right: 10px auto;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .chart{

        border: 2px solid #F57B3F;
        border-radius: 10px ;
        background-color: #FFF;
        width: 45%;
        
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

        @media screen and (max-width: 700px){
            margin-top: 15px;
            width: 20em;
            
        }
    }
`;

export const Resumo = styled.div`
    display: flex;
    flex-direction: column;
    border:2px solid  #F57B3F;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: 150px;
    background-color: #fff;
    border-radius: 10px;
    
    
    padding: 3px;

    h3{
        padding: 5px 0;
        text-align: center;
        border-bottom: 0.5px solid #E5E5E5;
    }
    
    h4{
        margin-top:5px;
        margin-left: 3px;
        margin-bottom: 3px
    }

    label{
        margin: 5px 10px;
    }

    @media screen and (max-width: 700px){
        width: 70%;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        
        h3{
            display: none;
        }

        h4{
            margin: 0;
        }
        
        .receitas-despesas{
            width: 50%;
            margin-left: 0;
            margin-top:5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-right: 1px solid #cecece;
        }

        .saldo{
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            
        }
    }
`;
export const Receitas = styled.div`
    display: none;
    background-color: #fff;
    border:2px solid  #F57B3F;
    border-radius: 7px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    

    h3{
        padding: 5px 0;
        text-align: center;
        border-bottom: 0.5px solid #E5E5E5;
    }

    table caption{
        font-size: 1.5em;

        margin-bottom: 5px;
    }

    table thead{
        border-bottom: 1px solid #CCC;
    }

    table thead tr{
        background-color: #fff;
        color: #F57B3F;
        height: 2.5em;
    }

    table button:first-child{
        margin-right: 5px;
    }

    table td{
        
        padding: 15px;
    }

    

    table button{
        border:0;
        padding: 5px;
        background-color: #F12D13;
        width: 80px;
        transition: 0.2s;
    }

    table button:hover{
        letter-spacing: 0.1em;
    }

    table button:first-child{
        background-color: #73B1E4;
    }

    @media screen and (max-width: 700px){
        margin: 10px auto;
        table{
            margin:0;
            
        }
    }
`;










export const Despesas = styled.div`
    background-color: #fff;
    border:2px solid  #F57B3F;
    border-radius: 7px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin: 5px 10px;
    h3{
        padding: 5px 0;
        text-align: center;
        border-bottom: 0.5px solid #E5E5E5;
    }

    table caption{
        font-size: 1.5em;
        margin-bottom: 5px;
    }

    table thead{
        
        border-bottom: 1px solid #CCC;
    }

    table thead tr{
        background-color: #fff;
        color: #F57B3F;
        height: 2.5em;
    }

    table button:first-child{
        margin-right: 5px;
    }

    table td{
        
        padding: 15px;
    }

    

    table button{
        border:0;
        padding: 5px;
        background-color: #F12D13;
        width: 80px;
        transition: 0.2s;
    }

    table button:hover{
        letter-spacing: 0.1em;
    }

    table button:first-child{
        background-color: #73B1E4;
    }

    @media screen and (max-width: 700px){
        display: none;
        margin-top: 10px;
        table{
            margin:0;
        }
    }
`;




