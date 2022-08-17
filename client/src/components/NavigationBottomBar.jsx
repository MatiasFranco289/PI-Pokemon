import React from "react";
import styles from '../styles/NavigationBottomBar.module.css';
import NavigationButtons from "./NavigationButtons";

export default function NavigationBottomBar(props){
    function createNavButtons(){
        let QuantButtons = Math.ceil(props.quantPokemons/12);
        let buttons = [];

        for(let f=0;f<QuantButtons;f++){
            buttons.push(<NavigationButtons name = {f+1} active = {props.page} key = {`NvBtn${f}`}/>)
        }

        return buttons;
    }

    return(
        <div className = {styles.mainWrapper}>
            {createNavButtons()}
        </div>
    )
}