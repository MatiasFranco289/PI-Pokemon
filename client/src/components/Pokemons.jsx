import React from "react";
import PokemonCard from "./PokemonCard.jsx";
import styles from '../styles/Pokemons.module.css';

export default function Pokemons(props){
    function createPokemonsCards(){
        let cards = [];
        let from = props.page*12;//Si page es 0 then 0*12=0, si es 1 then 1*12=12, etc
        let to = Math.min((from + 12), props.pokemonsData.length);//Esto devuelva el numero mas peque;o de los dos, evitando que {to} sea mayor al length de pokemons guardados

        for(let f=from;f<to;f++){
            let pokemon = props.pokemonsData[f];
            cards.push(
                <PokemonCard name = {pokemon.name} types = {pokemon.types} img = {props.images[f]} key = {`pkmCrd${f}`}/>
            )
        }
        //Si se da una pagina muy alta, digamos 5, from sera 5*12 = 48
        //Y then sera el largo del array pokemons, es decir 40
        //Entonces ni siquiera entrara en el for, por lo tanto deberiamos tirar un error por aca
        return cards.length?cards:<p>Error!</p>
    }

    return(
        <div className = {styles.mainWrapper}>   
           {createPokemonsCards()}
        </div>
    );
}