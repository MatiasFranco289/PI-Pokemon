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
        <div className = {styles.mainWrapper}>
            <div className = {styles.navBar}>
                <Link className = {styles.linkBtn} to = '/'>Home</Link>
                <Link className = {styles.linkBtn} to = '/create'>Create</Link>
            </div>
            <form className = {styles.buscadorWrapper} action="" method="get" onSubmit={(e) => manageSearch(e)}>
                <input type="text" name="busqueda" required = {true}/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}