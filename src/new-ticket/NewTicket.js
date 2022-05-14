import React from 'react'
import { AddTicketForm } from './AddTicketForm'
import {Container, Row, Col} from 'react-bootstrap'
import Layout from "../components/shared/Layout";

const NewTicket = () => {

  return (
    <Layout>
    <Container>
        <Row>
            <Col>
                <AddTicketForm />
            </Col>
        </Row>
    </Container>
    </Layout>
  )
}

export default NewTicket;
