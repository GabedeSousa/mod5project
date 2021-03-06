import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import ErrorMessages from '../components/shared/ErrorMessages'
import ProductForm from '../components/products/ProductForm'
import { verifyAndSetFieldErrors } from '../shared/helpers'

class EditProductForm extends Component {

    state = {
        name: '',
        description: '',
        price: '',
        quantity: '',
        errors: {},
        serverErrors: [],
        saved: false
    }

    componentDidMount = () =>{
        //plus sign will convert to a number
        const id = this.props.match && +this.props.match.params.id

        if (id) {
            this.getProduct(id)
        }
    }

    componentWillUnmount = () => {
        const id = this.props.match && this.props.match.params.id
        id && this.props.onEdit("edited")
        this.props.onUpdate(false)

        if (this.state.serverErrors.length > 0){
            this.resetSaved()
        }
    }

    getProduct = (id) => {
        axios
            .get(`/api/v1/products/${id}.json`)
            .then(response => {
                const product = response.data.product
                const idx = product.price.search(/\d/)
                product.price = product.price.slice(idx)

                this.setState({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity
                }, () => {
                    this.props.onEdit()
                })
            })
            .catch(error => console.log(error))
    }

    resetSaved = () => {
        this.setState({
            saved: false,
            serverErrors: []
        })
    }

    handleChange = () => {
        const { name, value } = event.target
        this.setState({ [name]: value })
        this.clearErrors(name, value)
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const fieldNames = ["name", "description", "price", "quantity"]
        verifyAndSetFieldErrors(this, fieldNames)

        if (Object.keys(this.state.errors).length === 0){
            const { id, name, description, price, quantity } = this.state
            const editedProduct = {
                id,
                name,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10)
            }
            this.handleProductUpdate(editedProduct)
        }
    }

    handleProductUpdate = () => {
        const updatedProduct = {
            product: {...data}
        }
        axios
        .put(`/api/v1/products/${data.id}.json`, updatedProduct)
        .then(response => {
            const { product } = response.data
            this.setState({
                ...product,
                serverErrors: [],
                saved: true
            }, () => {
                this.props.onUpdate(true)
                this.props.history.push(`/products/${data.id}`)
            })
        })
        .catch(error => {
            const updatedErrors = [
                ...this.state.serverErrors,
                ...error.response.data
            ]

            const errorsSet = new Set(updatedErrors)
            this.setState({ serverErrors: [...errorsSet]})
        })
    }

    checkErrors = (state, fieldName) => {
        const error = {}
        switch (fieldName){
            case 'name':
                if(!state.name){
                    error.name = "Name can't be blank"
                }
                break
                case 'description':
                if(!state.description){
                    error.description = "Description can't be blank"
                }
                break
                case 'price':
                if(parseFloat(state.price) <= 0.0 ||
                !state.price.toString().match(/^\d{1,}(\.\d{0,2})?$/)){
                    error.price = "Price has to be a positive number"
                }
                break
                case 'quantity':
                if(parseInt(state.quantity, 10) <= 0 ||
                !state.quantity.toString().match(/^\d{1,}$/)) {
                    error.quantity = "Quantity has to be a positive whole number"
                }
                break
        }
        return error
    }

    clearErrors = (name, value) => {
        let errors = {...this.state.errors}

        switch (name){
            case 'name':
                if(value.length > 0){
                    delete errors['name']
                }
                break
            case 'description':
                if(value.length > 0){
                    delete errors['description']
                }
                break
            case 'price':
                if(parseFloat(value) > 0.0 || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
                    delete errors['price']
                }
                break
            case 'quantity':
                if(parseInt(value, 10) > 0 || value.match(/^\d{1,}$/)) {
                    delete errors['quantity']
                    }
                break
                default:


        }
        this.setState({ errors })
    }
    
    handleBlur = (event) => {
        const { name } = event.target
        const fieldError = this.checkErrors(this.state, name)
        const errors = Object.assign({}, this.state.errors, fieldError)
        this.setState({ errors })
    }

    render () {
        const buttonText = 'Update Product'
        const title = 'Editing Product'

        return (
            <div className="container mb-4">
                {this.state.serverErrors.length > 0 &&
                <ErrorMessages errors={this.state.serverErrors} />
                }
             <div className="row">
                 <div className="col-md-8 offset-md-2">
                     <div className="card panel-div">
                         <h1 className="text-center form-header-style pt-2 pb-3">
                             { title }
                         </h1>
                         <ProductForm 
                            onSubmit={this.handleSubmit}
                            state={this.state}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            buttonText={buttonText}
                         />
                     </div>
                 </div>
             </div>
            </div>
        )
    }
}

EditProductForm.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
}

export default EditProductForm