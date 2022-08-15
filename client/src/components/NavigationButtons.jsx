import React from "react";
import {Link} from 'react-router-dom';
import styles from '../styles/NavigationButtons.module.css';

export default function NavigationButtons(props){
    const linkTo = `/home/${props.name-1}`;
    const classStyles = props.name-1==props.active?styles.navButtonActive:styles.navButton;

    return(
        <Link className = {classStyles} to = {linkTo}>{props.name}</Link>
    )
}