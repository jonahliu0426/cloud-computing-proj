import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import './add-ticket-form.css'
import { createNewTicket } from './AddTicketAction'

const initialFormData = {
    email:'',
    subject:'',
    category:'My Account',
    message:''
}
let initialFormError = localStorage.getItem('formError')
initialFormError = initialFormError ? JSON.parse(initialFormError) : {
    error: '',
    successMsg: '',
}
export const AddTicketForm = () => {

    const [formData, setformData] = useState(initialFormData)
    const [formError, setFormError] = useState(initialFormError)

    useEffect(() => {
        return () => {
            localStorage.removeItem('formError')
        }
    },[formError, formData])

    const handleOnChange = e => {
        const {name, value} = e.target
        let p1 = {...formData}
        p1[name] = value
        setformData(p1)
    }

    const handleOnSubmit = async e => {
        e.preventDefault()
        setFormError(initialFormError)
        try {
            const result = await createNewTicket(formData)
            console.log(result)
            if (result.status === 'error') {
                setFormError({
                    error: result.message,
                    successMsg: '',
                })
                return
            }
            setFormError({
                error: '',
                successMsg: result.message,
            })
        } catch (error) {
            setFormError({
                error: error.message,
                successMsg: '',
            })
        } finally {
            localStorage.setItem('formError', JSON.stringify(formError))
            setformData(initialFormData)
        }
    }

  return (
    <div className='jumbotron add-ticket-form mt-3 bg-light'>
    <h1 className='text-info text-center'>Submit Issue</h1>
    <hr />
    <div>
        {formError.error && <Alert variant = 'danger'>{formError.error}</Alert>}
        {formError.successMsg && <Alert variant='success'>{formError.successMsg}</Alert>}
    </div>
    <Form autoComplete='off' onSubmit={handleOnSubmit}>
        <Form.Group as={Row}>
            <Form.Label column sm={2}>Your Email:</Form.Label>
            <Col sm={10}>
            <Form.Control
            name='email'
            value={formData.email}
            onChange = {handleOnChange}
            placeholder='Email Adress'
            required
            />
            </Col>
        </Form.Group>
        <br></br>    
        <Form.Group  as={Row}>
            <Form.Label column sm={2}>Subject:</Form.Label>
            <Col sm={10}>
            <Form.Control
            name='subject'
            value={formData.subject}
            onChange = {handleOnChange}
            placeholder='Subject'
            required
            />
            {/* <Form.Text className='text-danger'>
                {formError.subject && "Subject is required"}
            </Form.Text> */}
            </Col>
        </Form.Group>
        <br></br>
        <Form.Group as={Row} controlId='formBasicSelect'>
            <Form.Label column sm={2}>Category:</Form.Label>
            <Col sm={10}>
            <Form.Control
            as='select'
            name='category'
            value={formData.category}
            onChange = {handleOnChange}            
            >
                <option value='My Account'>My Account</option>
                <option value='Wallet and Transaction Issues'>Wallet and Transaction Issues</option>
                <option value='Buying and Selling NFTs'>Buying and Selling NFTs</option>
                <option value='Developer Help'>Developer Help</option>
                <option value='Report Error Message'>Report Error Message</option>
                <option value='Report Fraudulent Activity'>Report Fraudulent Activity</option>
            </Form.Control>
            </Col>
        </Form.Group>
        <br></br>
        <Form.Group>
            <Form.Label>Issue Found:</Form.Label>
            <Form.Control
                as='textarea'
                name='message'
                rows='5'
                value={formData.message}
                onChange = {handleOnChange}
                required
                />
        </Form.Group>
        <br></br>
        <div className='d-grid gap-2'>        
            <Button type='submit' variant='info' block='true' size='lg'
        onClick={handleOnSubmit} style={{color: 'white', boxShadow: '5px 5px 15px -5px black'}}
        >Open Ticket</Button>
        </div>
    </Form>
    </div>
  )
}

