import React from 'react'

const Search = ({searchTerm,setSearchTerm}) => {
  return (
    <div className='search'>
      <div>
        <img src="./Vector.svg" alt="search icon" />
        <input
          type="text"
          placeholder="search through 1000+ movies"
          value={searchTerm}
          onChange={(event)=> setSearchTerm(event.target.value)}
          />
      </div>
      
    </div>
  )
}

export default Search