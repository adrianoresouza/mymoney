import styled from 'styled-components';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 210px;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 5px;
    background-color: #cecece;
    padding: .8em;
    

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
        border: 0;
        padding: 9px 0;
        color: white;
        border-radius: 5px;
    }

    button[type=submit]:hover{
        background-color: #FFF;
        color: #F57B3F;
    }

    @media screen and (max-width: 700px){
        margin-left: 10px;
    }
`;

export const TableCategorias = styled.div`
    background-color: #FFF;
    width: auto;
    display: flex;
    justify-content: center;
    border-radius: 5px;
    margin-top: 20px;

    table{
        border: 1px solid #CCC;
        border-collapse: collapse;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    }

    table thead tr{
        background-color: #F57B3F;
        color: white;
        height: 2.5em;
    }

    table button:first-child{
        margin-right: 5px;
    }

    table td{
        border-bottom: 1px solid #CCC;
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

    
`;
