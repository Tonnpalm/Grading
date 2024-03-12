import axios from 'axios'
import { Button } from '@mui/material'
import * as React from 'react';

function TestAPI() {
    const [staff, setStaff] = React.useState();

    function getStaff() {
        axios.get(`http://localhost:8000/api/staffs/?staffName=&page=1&perPage=5`)
            .then((response) => {
                console.log(response.data.staffs[0].staffName)
                setStaff(response.data.staffs[0].staffName)
            }) 
            .catch((error) => {
                console.log(error)
            })
    }
    React.useEffect(()=> {
        getStaff()
    }, [])

  return (
    <div>
        <Button onClick={getStaff}>
            Test API
        </Button>
        <p>{staff}</p>
    </div>
  )
}

export default TestAPI