import React, {useState, useEffect} from 'react'
import { AddTicketForm } from './AddTicketForm'
import {Container, Row, Col} from 'react-bootstrap'
import { TicketTable } from './TicketTable'
import './add-ticket-form.css'
import { UserContext } from "../App"
import Layout from "../components/shared/Layout";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries"
import { useQuery } from "@apollo/client"

const NewTicket = () => {
  const { currentUserId } = React.useContext(UserContext);

  const variables = { id: currentUserId }

  const { data } = useQuery(GET_EDIT_USER_PROFILE, { variables })
  let username = 'user'
  let email = ''
  if (data) {
    username = data.users_by_pk.username
    email = data.users_by_pk.email
  }

  return (
    <Layout>
    <Container>
        <Row>
            <Col>
                <AddTicketForm email={email}/>
            </Col>
            <Col>
              <div className='jumbotron2 mt-3 bg-light'>
                <TicketTable email="yufanren@yahoo.com" />
              </div>
            </Col>
        </Row>
    </Container>
    </Layout>
  )
}

export default NewTicket;
