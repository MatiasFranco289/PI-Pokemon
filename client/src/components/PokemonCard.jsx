import React from "react";
import styles from '../styles/PokemonCard.module.css';

export default function PokemonCard(props){
    let types = props.types.map(type => {return capitalizeFirstLetter(type)});
    types = types.join(', ');

    function capitalizeFirstLetter(str){
        return str[0].toUpperCase() + str.slice(1);
    }
    return (
        <div className = {styles.mainWrapper}>
            <h2>{capitalizeFirstLetter(props.name)}</h2>             
            <img src={props.img.src} alt={`${props.name}.jpg`}/>
            <h4>Tipos: {types}</h4>          
        </div>
    );
}