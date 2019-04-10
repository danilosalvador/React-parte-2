import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import FotoItem from './Foto';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

export default class Timeline extends Component {
    
    constructor(props) {
        super(props);
        this.state = {fotos:[]};
        this.login = this.props.login;
    }

    componentWillMount() {
        PubSub.subscribe('timeline', (topico, fotos) => {
            console.log(fotos);
            this.setState({fotos});
        });

        PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {

            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            
            const possivelLike = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);

            if (possivelLike === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikes = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
                fotoAchada.likers = novosLikes;
            }
            this.setState({fotos:this.state.fotos});
        });

        PubSub.subscribe('novos-comentarios', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
            fotoAchada.comentarios.push(infoComentario.novoComentario);
            this.setState({fotos:this.state.fotos});
        });
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== undefined) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    carregaFotos() {

        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }

        console.log(urlPerfil);

        fetch(urlPerfil)
            .then(response => response.json())
            .then(resultado => {
                this.setState({fotos:resultado});
            });
    }

    like(fotoId) {
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {
            method:'POST'
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error("Não foi possível realizar o like no momento.");
            }
        })
        .then(liker => {
            PubSub.publish('atualiza-liker', {fotoId, liker});
        })
        .catch(ex => {
            console.log(ex.message);
        });
    }

    comenta(fotoId, texto) {
        const requestInfo = {
            method:'POST',
            body:JSON.stringify({texto}),
            headers:new Headers({
                'Content-type':'application/json'     
            })
        };

        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Não foi possível realizar o comentário no momento.");
            }
        })
        .then(novoComentario => {
            PubSub.publish('novos-comentarios', {fotoId:fotoId, novoComentario});
        })
        .catch(ex => {
            console.log(ex.message);
        });
    }

    render() {
      return (
            <div className="fotos container">
                <TransitionGroup
                    className="timeline">
                    {
                        this.state.fotos.map(item => (
                            <CSSTransition
                                key={item.id}
                                timeout={500}
                                classNames="timeline">
                                <FotoItem 
                                    key={item.id} 
                                    foto={item}
                                    like={this.like}
                                    comenta={this.comenta}/>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
            </div>
        );
    }
}