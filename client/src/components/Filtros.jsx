import React from "react";
import styles from '../styles/Filtros.module.css';

export default function Filtros(props){
    const pokemons = props.pokemons;
    const pokemonsTypes = getPokemonTypes();

    function getPokemonTypes(){//Esto obtiene todos los tipos de pokemones disponibles en la store
        let types = {};
        let pokemonTypes = [];

        pokemons.forEach((pokemon) => {//Recorro el array de pokemons
            pokemon.types.forEach(type => {//Recorro su array de tipos
                type = type[0].toUpperCase() + type.slice(1);
                types[type] = null;//Los pusheo a este objeto
            })
        })

        for(let key in types){
            pokemonTypes.push(key);
        }

        return pokemonTypes;
    }

    function handleTypeFilter(e){
        alert('sex');
    }

    
    return(
    <div className = {styles.filtrosMainWrapper}>
        <h2>Filters</h2>

        <div className = {styles.filtersWrapperColumn}>
            <h4>Tipos</h4>

            <div className = {styles.typesContainer}>
                {pokemonsTypes.map((type, index) => {
                    return <button key = {`btnFltr${index}`} onClick={(e) => handleTypeFilter(e)}>{type}</button>
                })}
            </div>
        </div>

        <div className = {styles.filterWrapperRow}>
                <h4>Only originals</h4>

                <label className = {styles.switch}>
                    <input type="checkbox"/>
                    <span className = {styles.slider}></span>
                </label>
        </div>

        <div className = {styles.filtersWrapperColumn}>
                <h4>Order by</h4>
            <div className = {styles.mainselection}>
                <select>
                    <option value="none" select = 'selected'>None</option>
                    <option value = 'az'>Alphabetically ascending</option>
                    <option value = 'za'>Alphabetically descending</option>
                    <option value = 'aa'>By attack ascending</option>
                    <option value = 'ad'>By attack descending</option>
                </select>
            </div>
        </div>

        
    </div>

    )
}