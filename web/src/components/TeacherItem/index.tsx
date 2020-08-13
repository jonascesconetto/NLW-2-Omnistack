import React from 'react'

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'
import './styles.css'

function TeacherItem(){
    return(
        <article className="teacher-item">
                    
            <header>
                <img src="https://avatars3.githubusercontent.com/u/12466042?s=460&u=a207f410e3d74c86d7bbfbdac8792581ce21943f&v=4" alt=""/>
                <div>
                    <strong>Professor</strong>
                    <span>Matéria</span>
                </div>
            </header>

            <p>
                Biografia
            </p>

            <footer>
                <p>
                    Preço/hora
                    <strong>R$ 80,00</strong>
                </p>
                <button type="button">
                    <img src={whatsappIcon} alt="Whatsapp"/>
                    Entrar em contato
                </button>
            </footer>
        </article>
    );
}

export default TeacherItem;