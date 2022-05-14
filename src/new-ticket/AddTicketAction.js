import axios from 'axios'

const Url = ' http://107.21.54.34:3001/v1/ticket'


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
