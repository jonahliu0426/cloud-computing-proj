import React, {useState, useEffect} from 'react'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { getTickets } from './TicketAction'


export const TicketTable = ({email}) => {

    const [searchTicketList, setSearchTicketList] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const getTicketsForUser = async () => {
            try {
                const result = await getTickets(email)
                if (result.status && result.status === 'error') {
                    setError(result.message)
                }
                console.log(searchTicketList)
                result.data.filtered.reverse()
                setSearchTicketList(result.data.filtered)
            } catch (err) {
                setError(err)
            }
        }
        getTicketsForUser()
    }, [])
    
    // const {searchTicketList, isLoading, error } = useSelector(state => state.tickets) 

    if (error) return <h3>{error}</h3>
  return (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Opened Date</th>
            </tr>
        </thead>
        <tbody>
            {searchTicketList.length ? searchTicketList.map(ticket => 
            <tr key={ticket._id}>
                <td><Link to={`/select/${ticket._id}`}>{ticket.subject}</Link></td>
                <td>{ticket.status}</td>
                <td>{ticket.openAt && new Date(ticket.openAt).toLocaleDateString()}</td>               
            </tr>) :
            <tr>
                <td colSpan='4' className='text-center'>No Issue Found</td>       
            </tr>}                    
        </tbody> 
    </Table>
  )
}

