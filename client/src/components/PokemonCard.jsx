import React from "react";
import styles from '../styles/PokemonCard.module.css';
import {Link} from 'react-router-dom';

export default function PokemonCard(props){
    const url = `/pokemonDetails/${props.name}`
    let types = props.types.map(type => {return capitalizeFirstLetter(type)});
    types = types.join(', ');

    function capitalizeFirstLetter(str){
        return str[0].toUpperCase() + str.slice(1);
    }
    return (
        <Link to = {url} className = {styles.mainWrapper}>
            <h2>{capitalizeFirstLetter(props.name)}</h2>        
            <img src={props.img.src} alt={`${props.name}.jpg`}/>

            <div className = {styles.stripeBottom}>
                <h4>Tipos: {types}</h4> 
            </div>         
        </Link>
    );
}