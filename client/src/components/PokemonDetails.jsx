import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import styles from '../styles/PokemonDetails.module.css';
import { useNavigate } from "react-router-dom";
const loadingGif = require('../imgs/Loading.gif');

export default function PokemonDetails(){
    const {name} = useParams();
    const [pokemonInfo, setPokemonInfo] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function getPokemons(){
            let response;

            try{
                response = await fetch(`http://localhost:3000/pokemons?name=${name}`)
                .then(response => {
                    if(response.status===404) throw new Error('404');
                    return response.json();
                });

                setPokemonInfo(response)
            }
            catch(err){
                try{
                    response = await fetch(`http://localhost:3000/pokemons/${name}`)//Intento buscarlo por su id y no por su nombre
                    .then(data => {
                        if(data.status===404) throw new Error(404);
                        return data.json();
                    })

                    setPokemonInfo(response);
                }
                catch(err){//Si queres a;adir una pagina de not found este es el lugar

                }
            }
        }

        getPokemons();
    }, []);

    function showPokemonInfo(){
        let types = pokemonInfo.types;
        types = types.map(type => {return type[0].toUpperCase() + type.slice(1)});
        types = types.join('/')
        return (
        <div className = {styles.pokemonCard}>

            <div className = {styles.imgContainer}>
                <img src = {pokemonInfo.img} alt="" />
            </div>

            <div className = {styles.infoContainer}>
                <h1>{pokemonInfo.name[0].toUpperCase() + pokemonInfo.name.slice(1)}</h1>

                <div className = {styles.subInfoContainer}>
                    <div>
                        <h4>{types}</h4>
                        <p>Type</p>
                    </div>

                    <div>
                        <h4>{pokemonInfo.weight}kg</h4>
                        <p>Weight</p>
                    </div>

                    <div>
                        <h4>0.{pokemonInfo.height}m</h4>
                        <p>Height</p>
                    </div>
                </div>
                <div className = {styles.separator}></div>


                <div className = {styles.subInfoContainer}>
                    <div>
                        <h4>{pokemonInfo.hp}</h4>
                        <p>Hp</p>
                    </div>

                    <div>
                        <h4>{pokemonInfo.attack}</h4>
                        <p>Attack</p>
                    </div>

                    <div>
                        <h4>{pokemonInfo.defense}</h4>
                        <p>Defense</p>
                    </div>
                </div>

                <div className = {styles.separator}></div>

                <div className = {styles.subInfoContainer}>
                    <div>
                        <h4>{pokemonInfo.speed}</h4>
                        <p>Speed</p>
                    </div>

                    <div>
                        <h4>{pokemonInfo.id}</h4>
                        <p>Id</p>
                    </div>
                </div>
            </div>
        </div>)

        
    }

    return(
        <div className = {styles.mainWrapper}>
            {!pokemonInfo?null:
                <button onClick ={() => navigate(-1)} className = {styles.exitBtn}>Go back</button>
            }
            
            {!pokemonInfo?
            <div className = {styles.loadingWrapper}>
                <img src = {loadingGif} alt=""/>
                <h1>Searching...</h1>
            </div>:
            showPokemonInfo()}
        </div>
    )
}