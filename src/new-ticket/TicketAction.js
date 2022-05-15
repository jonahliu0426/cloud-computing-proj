import axios from 'axios'

const Url = ' http://107.21.54.34:3001/v1/ticket'
// const Url = ' http://localhost:3001/v1/ticket'


export const createNewTicket = (formData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios.post(Url, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        resolve(result.data);
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  };

export const getTickets = (email) => {

  return new Promise(async (resolve, reject) => {
      try {
          const result = await axios.get(
              Url + `/select/${email}`,
              {headers: {
                'Content-Type': 'application/json',
              }}
          )
          resolve(result)
      } catch (error) {
          reject(error)
      }
  })
}

export const getSingleTicket = (_id) => {

  return new Promise(async (resolve, reject) => {
      try {
          const result = await axios.get(
              Url + `/selectticket/${_id}`,
              {headers: {
                'Content-Type': 'application/json',
              }}
          )
          resolve(result)
      } catch (error) {
          console.log(error.message)
          reject(error)
      }
  })
}

export const updateTicketStatusClosed = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.patch(Url + `/select/close-ticket/${_id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      resolve(result.data);
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
};

export const replyOnTicket = (_id, msgObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.put(Url + `/select/${_id}`, msgObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      resolve(result.data);
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
};
