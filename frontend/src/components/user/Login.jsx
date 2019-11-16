import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Entrar',
    subtitle: 'Bem vindo ao JAE!'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: { email: '', senha: '' },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }
    cadastrar() {
        this.props.history.push("users");
    }


    renderForm() {
        return (
            <div className="form">
                <div className="row justify-content-center">                
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Senha</label>
                            <input type="password" className="form-control"
                                name="senha"
                                value={this.state.user.senha}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a senha..." />
                        </div>
                    </div>
                </div>
                                                            
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        
                        <button className="btn btn-success "
                            onClick={e => this.clear(e)}>
                            Logar
                        </button>
                        <button className="btn btn-primary ml-2"
                            onClick={e => this.cadastrar(e)}>
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    

    

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}