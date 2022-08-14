import React from "react"
import styles from '../styles/LandingPage.module.css';
import snorlaxImg from '../imgs/LandingPage_SleepingSnorlax.png';
import { Link } from "react-router-dom";

export default function LandingPage(){
    return(
        <div className = {styles.globalWrapper}>
           <div className = {styles.backgroundImg}></div>
           <div className = {styles.mainWrapper}>
                <div className = {styles.subContainer1}>
                    <h1>Pokemons!</h1>
                    <hr />
                    <h3>Busca Pokemons en nuestra pagina y si no lo encontras...</h3>
                    <h3>Crealo!</h3>
                    <div className = {styles.btnContainer}>
                        {/* <button>Ingresar</button> */}
                        <Link className = {styles.linkBtn} to = '/home'>Ingresar</Link>
                    </div>
                </div>

                <div className = {styles.subContainer2}>
                   <img src = {snorlaxImg} alt="" />
                </div>
           </div>
        </div>
    );
}