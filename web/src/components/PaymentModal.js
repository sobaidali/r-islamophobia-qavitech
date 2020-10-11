import React, { Component } from 'react';

//Reactstrap
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//Evergreen ui
import { toaster } from 'evergreen-ui';

//Axios
import Axios from '../constants/constants'

class PaymentModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modal: false,
            tokenID: this.props.body.tokenID,
            amount: null,
            isOpen: this.props.isOpen
        }
        console.log(this.state.tokenID)
    }
    
    onHandleChange = (e) => {
        const { value } = e.target
        this.setState({
            amount: value
        }, () => {
            console.log(this.state.amount)
        })
    }

    onDonate = () => {
        let { amount, tokenID} = this.state

        if (localStorage.getItem('jwtToken')) {
            Axios.post('/users/donate',
            {
                amount: parseFloat(amount),
                tokenID: tokenID
            },
            {
                headers: { Authorization : localStorage.getItem('jwtToken')}
            },
            )
            .then(res => {
                toaster.success('Thank you for donating to Islamophobia')
                this.setState({
                    isOpen: false
                })
            })
            .catch(err => {
                toaster.danger('Unable to donate!')
            })
        } else {
            Axios.post('/users/donateasnonuser', {
                amount: parseFloat(this.state.amount),
                tokenID: this.state.tokenID
            }
            )
            .then(res => {
                toaster.success('Thank you for donating to Islamophobia')
                this.setState({
                    isOpen: false
                })
            })
            .catch(err => {
                toaster.danger('Unable to donate!')
            })
        }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isOpen} backdrop="static" toggle={this.props.toggle} body={this.props.body} className="PaymentModals">
                    <ModalHeader className="paymentModalHeader" toggle={this.props.toggle}> Donate </ModalHeader>
                    <Form>
                        <ModalBody>
                            <div class="form-group container">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                    <Input 
                                        required 
                                        placeholder="Amount"
                                        onChange={this.onHandleChange}
                                    />
                                </InputGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter className="PaymentModalFooter">
                            <Button color="primary" onClick={this.onDonate}>Donate</Button>
                            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default PaymentModal
