import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { replyOnTicket } from './TicketAction'
import { GET_EDIT_USER_PROFILE } from "../graphql/queries"
import { useQuery } from "@apollo/client"
import { UserContext } from "../App"

export const UpdateTicket = ({_id}) => {
  const { currentUserId } = React.useContext(UserContext);

  const variables = { id: currentUserId }

  const { data } = useQuery(GET_EDIT_USER_PROFILE, { variables })
  let name = 'user'
  if (data) {
    name = data.users_by_pk.username
  }

  const [msg, setMsg] = useState('')
  const handleOnChange = e => {
      setMsg(e.target.value)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const msgObj = {
      message: msg,
      name: name,
    }
    await replyOnTicket(_id, msgObj)
    setMsg('')
    window.location.reload()
  }

  return (
    <Form onSubmit={handleOnSubmit}>
        <Form.Label>Replay</Form.Label>
        <br></br>
        <Form.Text>Please reply your messsage here.</Form.Text>
        <Form.Control
        as='textarea'
        row='7'
        name='detail'
        value={msg}
        onChange={handleOnChange}
        />
        <div className='text-end mt-3 mb-3'>
            <Button variant='info' type='submit'>
                Reply
            </Button>           
        </div>
    </Form>
  )
}