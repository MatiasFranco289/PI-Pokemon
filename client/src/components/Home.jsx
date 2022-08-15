import React from "react";
import styles from "../styles/Home.module.css";
import Pokemons from './Pokemons';
import NavigationBottomBar from './NavigationBottomBar';
import {useParams} from 'react-router-dom';

export default function Home(){
    let {page} = useParams();//Aca agarro el param /:page del link
    page = (!page || isNaN(page))?0:page;//Si no se paso ningun param o el param pasado no es un numero, por defecto sera 0

    return(
        <div className = {styles.mainWrapper}>
            <h1>Soy Home</h1>
            <Pokemons page = {page}/>
            <NavigationBottomBar page = {page}/>
        </div>
    );
}