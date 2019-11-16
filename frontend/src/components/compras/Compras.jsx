import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'shopping-cart',
    title: 'Compras',
    subtitle: 'Adquira aqui seu ingresso!'
}

const baseUrl = 'http://localhost:3001/compras';
const baseUrlUsers = 'http://localhost:3001/users';
const baseUrlProducts = 'http://localhost:3001/products';

const initialState = {
    compra: { id_user: '', id_product: '', amount: 1, price: 0 },
    list: [],
    listUsers: [],
    listProducts: [],
    qtdError: ''
}

export default class Compras extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        });
        axios(baseUrlUsers).then(resp => {
            this.setState({
                listUsers: resp.data,
                compra: {
                    ...this.state.compra,
                    id_user: resp.data[0].id
                }
            });
        });
        axios(baseUrlProducts).then(resp => {
            this.setState({
                listProducts: resp.data,
                compra: {
                    ...this.state.compra,
                    id_product: resp.data[0].id
                }
            });
            this.calculatePrice();
        });
    }

    async clear() {

        await this.setState({
            compra: {
                id_user: this.state.listUsers[0].id,
                id_product: this.state.listProducts[0].id,
                amount: 1,
                price: 0
            }
        });
        this.calculatePrice()
    }

    async save() {
        const compra = this.state.compra
        const method = compra.id ? 'put' : 'post'
        const url = compra.id ? `${baseUrl}/${compra.id}` : baseUrl
        axios[method](url, compra)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({
                    compra: {
                        id_user: this.state.listUsers[0].id,
                        id_product: this.state.listProducts[0].id,
                        amount: 1,
                        price: 0
                    },
                    list
                })
                this.calculatePrice();
            })
        if (method == 'post') {
            const product = this.state.listProducts.find(
                p => p.id == this.state.compra.id_product
            )
            product.amount = product.amount - compra.amount
            axios.put(`${baseUrlProducts}/${product.id}`, product)
            let listProducts = this.state.listProducts
            const position = listProducts.findIndex(p => p.id == compra.id_product)
            listProducts[position] = product
            this.setState({listProducts})
        }
    }

    getUpdatedList(compra, add = true) {
        const list = this.state.list.filter(compraList => compraList.id !== compra.id)
        if (add) list.unshift(compra)
        return list
    }

    async updateField(event) {
        const compra = { ...this.state.compra };
        compra[event.target.name] = parseInt(event.target.value, 10);
        await this.setState({ compra });
        this.calculatePrice();
    }
    calculatePrice() {
        const product = this.state.listProducts.find(
            p => p.id === this.state.compra.id_product
        );
        if (this.state.compra.amount > product.amount) {
            this.setState({ qtdError: 'Quantidade maior que a disponível no estoque(' + product.amount + ')' })
        } else {
            const price = product.price * this.state.compra.amount;

            this.setState({
                compra: {
                    ...this.state.compra,
                    price
                },
                qtdError: ''
            });
        }
    }
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Usuário</label>
                            <select
                                className="form-control"
                                name="id_user"
                                value={this.state.compra.id_user}
                                onChange={e => this.updateField(e)}
                            >
                                {this.state.listUsers.map(user => {
                                    return (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Produto</label>
                            <select
                                className="form-control"
                                name="id_product"
                                value={this.state.compra.id_product}
                                onChange={e => this.updateField(e)}
                            >
                                {this.state.listProducts.map(product => {
                                    return (
                                        <option key={product.id} value={product.id}>
                                            {product.description}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className={this.state.qtdError ? 'text-danger' : ''}>Quantidade</label>
                            <input type="number"
                                min="1"
                                className={"form-control " + (this.state.qtdError ? "is-invalid text-danger" : "")}
                                name="amount"
                                value={this.state.compra.amount}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a quantidade..." />
                            <label className="text-danger">{this.state.qtdError}</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Total</label>
                            <h2>R$ {this.state.compra.price.toFixed(2).replace('.', ',')}</h2>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)} disabled={this.state.qtdError}>
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

    load(compra) {
        this.setState({ compra })
    }

    remove(compra) {
        axios.delete(`${baseUrl}/${compra.id}`).then(resp => {
            const list = this.getUpdatedList(compra, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
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
        return this.state.list.map(compra => {
            return (
                <tr key={compra.id}>
                    <td>{compra.id}</td>
                    <td>{compra.id_user}</td>
                    <td>{compra.id_user}</td>
                    <td>{compra.amount}</td>
                    <td>
                        R${' '}
                        {
                            parseFloat(compra.price)
                                .toFixed(2)
                                .replace('.', ',')
                        }
                    </td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(compra)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(compra)}>
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