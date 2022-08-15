import React from "react";
import styles from '../styles/NavigationBottomBar.module.css';
import {useSelector} from 'react-redux';
import NavigationButtons from "./NavigationButtons";

export default function NavigationBottomBar(props){
    const QuantPokemons = useSelector(store => store.pokemons.length);
    function createNavButtons(){
        let QuantButtons = Math.ceil(QuantPokemons/12);
        let buttons = [];

        for(let f=0;f<QuantButtons;f++){
            buttons.push(<NavigationButtons name = {f+1} active = {props.page} key = {`NvBtn${f}`}/>)
        }

        return buttons;
    }

    return(
        <div className = {!QuantPokemons?styles.hiddenMainWrapper:styles.mainWrapper}>
            {QuantPokemons?createNavButtons():null}
        </div>
    )
}