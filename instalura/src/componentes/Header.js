import React, { Component } from 'react';
import PubSub from 'pubsub-js';
export default class Header extends Component {

  pesquisa(evento) {
    evento.preventDefault();
    fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${this.loginPesquisado.value}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Não foi possível realizar a pesquisa no momento");
        }
      })
      .then(fotos => {
        PubSub.publish('timeline', fotos)
      })
      .catch(ex => {
        console.log(ex.message)
      });
  }

  render() {
      return (
          <header className="header container">
          <h1 className="header-logo">
            Instalura
          </h1>

          <form className="header-busca" onSubmit={this.pesquisa.bind(this)}>
            <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.loginPesquisado = input} />
            <input type="submit" value="Buscar" className="header-busca-submit"/>
          </form>


          <nav>
            <ul className="header-nav">
              <li className="header-nav-item">
                <a href="#">
                  
                </a>
              </li>
            </ul>
          </nav>
        </header>
      );
  }
}
