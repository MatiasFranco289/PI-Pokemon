import React from "react";
import styles from "../styles/Home.module.css";
import Pokemons from './Pokemons';

export default function Home(){
    return(
        <div className = {styles.mainWrapper}>
            <h1>Soy Home</h1>
            <Pokemons/>
        </div>
    );
}