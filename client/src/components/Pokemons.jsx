import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';//El useDispatch me permite despachar acciones y el useSelector me permite traer propiedades de la store
import {getPokemons} from '../actions/index.js';//Esta son las acciones redux que defini
import PokemonCard from "./PokemonCard.jsx";
import styles from '../styles/Pokemons.module.css';

export default function Pokemons(props){
    const dispatch = useDispatch();
    const pokemonsData = useSelector(store => store.pokemons);//Pido de la redux store la propiedad pokemons
    const [images, setImages] = useState();

    useEffect(() => {//Se corre esta funcion OnStart una sola vez porque al final tiene []
        dispatch(getPokemons(0, 40, true));//Hago un dispatch pidiendo los pokemons que necesito
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

    function createPokemonsCards(){
        let cards = [];
        let from = props.page*12;//Si page es 0 then 0*12=0, si es 1 then 1*12=12, etc
        let to = Math.min((from + 12), pokemonsData.length);//Esto devuelva el numero mas peque;o de los dos, evitando que {to} sea mayor al length de pokemons guardados

        for(let f=from;f<to;f++){
            let pokemon = pokemonsData[f];
            cards.push(
                <PokemonCard name = {pokemon.name} types = {pokemon.types} img = {images[f]} key = {`pkmCrd${f}`}/>
            )
        }
        //Si se da una pagina muy alta, digamos 5, from sera 5*12 = 48
        //Y then sera el largo del array pokemons, es decir 40
        //Entonces ni siquiera entrara en el for, por lo tanto deberiamos tirar un error por aca
        return cards.length?cards:<p>Error!</p>
    }

    return(
        <div className = {styles.mainWrapper}>   
           {!images?<p>Loading...</p>://Si todavia no tengo las imagenes cargadas muestro el mensaje de cargando
            createPokemonsCards()} {/* Si ya tengo la info que necesito creo las cartas para cada pokemon */}
        </div>
    );
}