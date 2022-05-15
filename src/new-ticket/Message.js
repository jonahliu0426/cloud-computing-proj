import React from 'react'
import './message.css'

export const Message = ({message}) => {

    if(!message) return null
  
  return message.map((row, i) => (

    <div className='message-history mt-5' key={i}>
        <div className='send font-weight-bold text-secondary mt-3'>
            <div className='sender'>Sender: {row.sender}</div>
            <div className='date'>Date: {row.msgAt && new Date(row.msgAt).toLocaleString()}</div>
        </div>
        <div className='message'>{row.message}</div>
    </div>
  ))
}