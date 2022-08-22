import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/NavigationBottomBar.module.css';
import NavigationButtons from "./NavigationButtons";

export default function NavigationBottomBar(props){
    const navigate = useNavigate();

    useEffect(() => {
        //Si el usuario llega a cambiar manualmente el link puede sobrepasar la cantida de pokemons que tengo, esto lo devuelve a la pagina 1 dado el caso
        if((props.page*12) > props.quantPokemons) return navigate('/home/0');
    })
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