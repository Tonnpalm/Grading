// eslint-disable-next-line no-unused-vars
import React from 'react'
import SearchAppBar from '../AppBar/ButtonAppBar';
import AddSubjectCard from '../AddSubject/AddSubjectCard/AddSubjectCard';
import './AddSubject.css'


function AddSubject() {
  return (
    <div>
      <SearchAppBar/>
      <div className='add-container'>
        <AddSubjectCard/> 
      </div>  
    </div>
  )
}

export default AddSubject;
