import React, {useState, useEffect} from 'react'
import {Container, Row, Col, Button, Spinner, Alert} from 'react-bootstrap'
import { Message } from './Message'
import { UpdateTicket } from './UpdateTicket'
import { useParams} from 'react-router-dom'
import Layout from "../components/shared/Layout";
import {getSingleTicket, updateTicketStatusClosed} from './TicketAction'
// const ticket = tickets[0]
export const Ticket = () => {

    const {tid} = useParams()
    const [selectedTicket, setSelectedTicket] = useState({})
    const [error, setError] = useState('')
    const [replyMsg, setReplyMsg] = useState('')

    useEffect(() => {
        const getTicket = async (tid) => {
            try {
                const result = await getSingleTicket(tid)
                if (result.status && result.status === 'error') {
                    setError(result.message)
                }
                console.log(result.data)
                setSelectedTicket(result.data.result[0])
            } catch (err) {
                setError(err)
            }
        }
        getTicket(tid)
    }, [])

    const handleOnClick = async() => {
        try {
            const result = await updateTicketStatusClosed(tid)
            if (result.status && result.status === 'error') {
                setError(result.message)
            }
            setReplyMsg(result.message)
        } catch (error) {
            setError(error.message)
        }
    }

  return (
      <Layout>
    <Container>
        <Row>
            <Col>
                {error && <Alert variant='danger'>{error}</Alert>}
                {replyMsg && <Alert variant='success'>{replyMsg}</Alert>}
            </Col>
        </Row>
        <Row>
            <Col className='text-weight-bolder text-secondary'>
                <div className='category'>Category: {selectedTicket.category}</div>
                <div className='subject'>Subject: {selectedTicket.subject}</div>
                <div className='date'>Date: {selectedTicket.openAt && new Date(selectedTicket.openAt).toLocaleString()}</div>
                <div className='status'>Status: {selectedTicket.status}</div>
                <div className='email'>Emial Address: {selectedTicket.email}</div>
            </Col>
            <Col>
                <Button variant='outline-info' 
                onClick={handleOnClick}
                disabled = {selectedTicket.status === 'Closed'}
                >
                    Close Ticket
                </Button>
            </Col>
        </Row>
        <Row className='mt-4'>
            <Col>
                {selectedTicket.conversations &&
                <Message message={selectedTicket.conversations}/>
                }
            </Col>
        </Row>
        <hr />
        <Row className='mt-4'>
            <Col>
                <UpdateTicket _id={tid}/>
            </Col>
        </Row>
    </Container>
    </Layout>
  )
}
