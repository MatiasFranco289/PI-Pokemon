import React from "react";
import styles from '../styles/PokemonCard.module.css';

export default function PokemonCard(props){
    var types = props.types.join(', ');

    return (
        <div className = {styles.mainWrapper}>
            <h2>{props.name}</h2>             
            <img src={props.img.src} alt={`${props.name}.jpg`}/>
            <h4>Tipos: {types}</h4> 
{/*             <p>{props.types[0]}</p>
                     */}             
        </div>
    );
}