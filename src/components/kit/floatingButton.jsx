import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import NewForm from './cards/newFormCard'
import NewFormItem from './cards/newItemFormCard'

function FlyingButton({ belongsTo }) {
    const navigate = useNavigate()
    const [openNewForm, setOpenNewForm] = useState(false)

  return (
    <>
        <div className="float-buttton fixed bottom-10 text-4xl right-10 font-extralight text-white shadow-xl z-10">
            <button onClick={() => setOpenNewForm(!openNewForm)}>
                <p className='leading-[1] -translate-y-[1px] !m-0 py-4 px-5 text-sm'>&#43; ADD</p>
            </button>
        </div>
        { (openNewForm && (belongsTo == 'department' || belongsTo == 'divisi')) &&
            <NewForm formOpen={openNewForm} setFormOpen={setOpenNewForm} belongsTo={belongsTo} />
        }
        { openNewForm && belongsTo == 'barang' &&
            <NewFormItem formOpen={openNewForm} setFormOpen={setOpenNewForm} belongsTo={belongsTo} />
        }
        
    </>
  )
}

export default FlyingButton