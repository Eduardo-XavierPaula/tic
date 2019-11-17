import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'tag',
    title: 'Home Page',
    subtitle: 'Confira os eventos em destaque!'
}

const baseUrl = 'http://localhost:3001/eventos'
const initialState = {
    evento: { name: '', data: '', ingresso: '', price: '' },
    list: [],
    pesquisa: '',
    
}

export default class Home extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    getUpdatedList(evento, add = true) {
        
        const list = this.state.list.filter(u => u.id !== evento.id)
        
        if (add) list.unshift(evento)
        return list
    }


    updateField(event) {
        const pesquisa = event.target.value
        
        this.setState({pesquisa})
        this.refresh(pesquisa)
        console.log(pesquisa)
    }
    load(evento) {
        this.props.history.push("comprar/"+evento.id);
    }
    refresh(name = '') {
        axios.get(`${baseUrl}?q=${name}`)
            .then(resp => this.setState({
                ...this.state, name, list:
                    resp.data                    
            }))            
    }

    handleSearch(event) {
        const pesquisa = {...this.state.pesquisa} 
        pesquisa[event.target.name] = event.target.value
        this.setState({ pesquisa })
        console.log(pesquisa)
        this.refresh(this.state.pesquisa)
    }
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">                          
                    <input
                        name="pesquisa"
                        placeholder="Pesquise o evento aqui..."
                        className="form-control"
                        value={this.state.pesquisa}                        
                        onChange={e =>this.updateField(e)}
                        />                                    
                    </div>
                    
                </div>
            </div> 
        )
    }
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>                        
                        <th>Evento</th>
                        <th>Data</th>
                        <th>Ingressos</th>
                        <th>Preço</th>
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
                    <td>{evento.name}</td>
                    <td>{evento.data}</td>
                    <td>{evento.ingresso}</td>
                    <td>{evento.price}</td>
                    <td>
                        <button className="btn btn-success"
                            onClick={() => this.load(evento)}>
                            <i className="fa fa-shopping-cart"></i>
                            
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