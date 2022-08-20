import React from "react";
import styles from '../styles/Buscador.module.css';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';

export default function Buscador(){
    const navigate = useNavigate();

    function manageSearch(e){
        e.preventDefault();
        let busqueda = e.target.busqueda.value;//Obtengo lo que el usuario escribio en el input

        //Agregar santizacion por aca
        busqueda = busqueda.toLowerCase();
        navigate(`/pokemonDetails/${busqueda}`);
    }

    return(
        <form className = {styles.buscadorWrapper} action="" method="get" onSubmit={(e) => manageSearch(e)}>
            <Link to='/create'>TOCAMEEE</Link>
            <input type="text" name="busqueda" required = {true}/>
            <button type="submit">Buscar</button>
        </form>
    );
}