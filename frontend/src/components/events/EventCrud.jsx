import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'calendar-check-o',
    title: 'Evento',
    subtitle: 'Administre seus eventos aqui!'
}

const baseUrl = 'http://localhost:3001/eventos'
const initialState = {
    evento: { name: '', ingresso: '', ingressoMeia:'', data:'',time:'', idade:"+18",price:'' },
    list: [],
    inptError: '',
}

export default class eventos extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ evento: initialState.evento })
        this.setState({                
            inptError: ''
        });
    }

    save() {
        const evento = this.state.evento
        const method = evento.id ? 'put' : 'post'
        const url = evento.id ? `${baseUrl}/${evento.id}` : baseUrl
        axios[method](url, evento)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ evento: initialState.evento, list })
            })
    }

    getUpdatedList(evento, add = true) {
        const list = this.state.list.filter(u => u.id !== evento.id)
        if(add) list.unshift(evento)
        return list
    }

    updateField(event) {
        const evento = { ...this.state.evento }
        evento[event.target.name] = event.target.value
        this.setState({ evento })
        this.setState({                
            inptError: ''
        });
        
    }
    CheckInput(e) {
        
        if (this.state.evento.name == '' 
            || this.state.evento.ingresso=='' 
            ||  this.state.evento.ingressoMeia==''
            ||  this.state.evento.data==''
            ||  this.state.evento.time==''
            ||  this.state.evento.price=='') 
            {
                this.setState({ inptError: ' é obrigatório...' })                        
        } else {

            this.setState({                
                inptError: '',                
            });
            this.save(e)
        }
    }
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className={this.state.inptError ? 'text-danger' : ''}>Nome do Evento{this.state.inptError}</label>
                            <input type="text" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="name"
                                value={this.state.evento.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                            
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className={this.state.inptError ? 'text-danger' : ''}> Quantidade Ingresso {this.state.inptError}</label>                            
                            <input type="number" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="ingresso"
                                value={this.state.evento.ingresso}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a quantidade..." />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className={this.state.inptError ? 'text-danger' : ''}>Data do evento {this.state.inptError}</label>
                            <input type="date" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="data"
                                value={this.state.evento.data}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a data..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className={this.state.inptError ? 'text-danger' : ''}>Quantidade Ingresso Meia  {this.state.inptError}</label>
                            <input type="number" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="ingressoMeia"
                                value={this.state.evento.ingressoMeia}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a quantidade..." />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label  className={this.state.inptError ? 'text-danger' : ''}>Hora do evento {this.state.inptError}</label>
                            <input type="time" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="time"
                                value={this.state.evento.time}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a data..." />
                        </div>
                    </div>                
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Faixa etária da festa</label>
                                                
                            <select
                                className="form-control"
                                name="idade"
                                onChange={e => this.updateField(e)} 
                                value={this.state.evento.idade}                        
                                >
                                
                                <option value="+18">+18</option>
                                <option value="+16">+16</option>
                                <option value="Livre">Livre</option>
                            </select>                        
      
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label  className={this.state.inptError ? 'text-danger' : ''}>Preço do ingresso  {this.state.inptError}</label>
                            <input type="number" className={"form-control " + (this.state.inptError ? "is-invalid text-danger" : "")}
                                name="price"
                                value={this.state.evento.price}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o preço..." />
                        </div>
                    </div>
                </div>
                
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.CheckInput(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(evento) {
        this.setState({ evento })
    }

    remove(evento) {
        axios.delete(`${baseUrl}/${evento.id}`).then(resp => {
            const list = this.getUpdatedList(evento, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ingresso</th>
                        <th>Preço</th>
                        <th>Data</th>
                        <th>Faixa etária</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(evento => {
            return (
                <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td>{evento.name}</td>
                    <td>{evento.ingresso}</td>                    
                    <td>{evento.price}</td>
                    <td>{evento.data}</td>
                    <td>{evento.idade}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(evento)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(evento)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}