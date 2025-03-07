import Navbar from '../kit/customNavbar';
import SearchBar from '../kit/SearchBar';
import ScrollPagination from '../kit/scrollPagination';
import DepartmentCards from '../kit/cards/departmentCards';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Transition from '../kit/Transition';
import Loader from '../kit/Loader';
import { encrypting } from '../../helper/encryptHelper';
import api from '../../api/api';
import Swal from 'sweetalert2';
import FloatingButton from '../kit/floatingButton';
import NewForm from '../kit/cards/newFormCard';

function restoreDivisi(){
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [nextCursor, setNextCursor] = useState(null)
    const [contentVisible, setContentVisible] = useState(false)
    const typingTimeoutRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchItems()
    }, [searchTerm])

    const fetchItems = async () => {
        try {
            setLoading(true)
            const response = await api.get(searchTerm ? `divisiTrash/${searchTerm}` : `divisiTrash`) 
            const data = response.data.data
            setItems(data.data)
            setNextCursor(data.next_cursor)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setTimeout(() => setContentVisible(true), 50)
        }
    }

    const fetchMoreItems = async() => {
        if (loading || !nextCursor) return;
        try {
            setLoading(true)
            const response = await api.get(searchTerm ? `divisiTrash/${searchTerm}` : `divisiTrash`, {
                params : {
                    cursor : nextCursor
                }
            }) 
            const data = response.data.data
            setItems((prevItems) => {
                const existingIds = new Set(prevItems.map(item => item.id))
                const newIds = data.data.filter((item) => !existingIds.has(item.id))
                return [...prevItems, ...newIds]
            })            
            setNextCursor(data.next_cursor)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setTimeout(() => setContentVisible(true), 50)

        }
    }

    const deleteItems = async (id, name) => {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete ${name} divisi?`,
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
              actions: 'my-actions',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            },
          });
    
          if (result.isConfirmed) {
            await api.delete(`/divisi/${id}`);
            setItems(items.filter((data) => data.id !== id));
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
            })
          }
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Failed to delete!',
                text:'something went wrong, try again'
            })
        }
    }

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setSearchTerm(query);
        }, 750);
    };

    const restoreItems =  async (id, name) => {
        try {
            const result = await Swal.fire({
              title: `Apakah Anda Mau Restore ${name}`,
              icon: 'question',
              showDenyButton: true,
              confirmButtonText: 'Yes',
              denyButtonText: 'No',
              customClass: {
                actions: 'my-actions',
                confirmButton: 'order-2',
                denyButton: 'order-3',
              },
            });
      
            if (result.isConfirmed) {
              await api.get(`/divisi/restore/${id}`);
              setItems(items.filter((item) => item.id !== id));
              await Swal.fire('Berhasil!', '', 'success');
            }
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Merestore divisi',
                text:'Ada Kesalahan Dalam Sistem'
            })
        }
    }

    return(
        <>
        {/* <Transition contentVisible={contentVisible}> */}
            <Navbar title={'Divisi'}/>
            <div className="mx-12 p-12 pt-24 grid grid-cols-6 grid-rows-3 border border-t-0"  style={{ gridTemplateRows: 'auto auto' }}>
                <div className='row-start-1 col-start-1 col-span-full'>
                    <a onClick={() => navigate('/divisi')}>&#8592; back</a>
                    <p className='!mt-2 font-bold text-5xl'>Restore Divisi</p>
                </div>
                <div className='row-start-2 col-start-1 col-span-4 place-content-center'>
                    <SearchBar disable={loading} onChange={handleSearchChange} values={searchQuery} />
                </div>
                <div className='row-start-3 col-span-full'>
                    <Transition contentVisible={contentVisible}>
                        <div className='grid grid-cols-2 gap-6 mt-5'>
                            <ScrollPagination fetchMoreItems={fetchMoreItems} loading={loading} nextCursor={nextCursor}>
                                {
                                    ( items.map((data) => (
                                        <DepartmentCards
                                        key={data.id}
                                        data={data}
                                        restoreItems={restoreItems}
                                        restore={true}
                                        belong={'divisi'}
                                        />
                                    )))
                                }
                            </ScrollPagination>
                        </div>
                    </Transition>
                </div>
                <FloatingButton ref='divisi'/>
                    { loading && <Loader Class={'col-span-full'}/> } 
            </div>
        {/* </Transition> */}
        </>
    );
}

export default restoreDivisi;