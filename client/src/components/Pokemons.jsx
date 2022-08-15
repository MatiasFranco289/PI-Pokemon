import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';//El useDispatch me permite despachar acciones y el useSelector me permite traer propiedades de la store
import {getPokemons} from '../actions/index.js';//Esta son las acciones redux que defini
import PokemonCard from "./PokemonCard.jsx";
import styles from '../styles/Pokemons.module.css';

export default function Pokemons(){
    const dispatch = useDispatch();
    const pokemonsData = useSelector(store => store.pokemons);//Pido de la redux store la propiedad pokemons
    const [images, setImages] = useState();

    useEffect(() => {//Se corre esta funcion OnStart una sola vez porque al final tiene []
        dispatch(getPokemons(0, 12, true));//Hago un dispatch pidiendo los pokemons que necesito
    },[]);

    useEffect(() => {//Esto se ejecuta cuando ${pokemonsData} cambie
        if(!pokemonsData.length) return;//Tambien se ejecuta al principio asi que esto es para que no entre si no estan cargados los pokemons

        const imagePromises = pokemonsData.map((pokemon) => {//Creo una promesa por cada pokemon y las guardo en el array imagePromises
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => resolve(img));
                img.addEventListener('error', err => reject(err));
                img.src = pokemon.img;
            })
        })

        Promise.all(imagePromises).//Ejecuto todas las promesas 
        then(response => setImages(response)).//Cuando tenga una respuesta actualizo el estado de este componente forzandolo a re-renderizarse
        catch(err => setImages(err));
    }, [pokemonsData])

    return(
        <div className = {styles.mainWrapper}>   
           {!images?<p>Loading...</p>://Si todavia no tengo las imagenes cargadas muestro el mensaje de cargando
            pokemonsData.map((pokemon, index) => {//Si ya tengo todo lo necesario creo una carta por cada pokemon
                return <PokemonCard name = {pokemon.name} types = {pokemon.types} img = {images[index]} key = {`card${index}`}/>
            })}
        </div>
    );
}