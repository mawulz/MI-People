import React from 'react'
import 'boxicons/css/boxicons.min.css';

function SearchBar({values, disable, onSearch, onChange, className,}) {

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <>
        <div className={`bg-white px-3 py-2 rounded-full flex items-center font-inter border ${className}`}>
          <input 
            type='text' 
            placeholder='Search' 
            className='w-full text-center placeholder-gray-500 border-none outline-none' 
            value={values}
            onChange={handleChange}
            disabled={disable}
            id='search-bar'
          />
          <label htmlFor='search-bar'>
            <i className='bx bx-search text-2xl -translate-x-1 translate-y-0 text-black-300'></i>
          </label>
        </div>
    </>
  )
}

export default SearchBar