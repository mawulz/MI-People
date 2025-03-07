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

function listDivisi(){
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
            const response = await api.get(searchTerm ? `divisi/search/${searchTerm}` : '/divisi')
            const data = response.data.data
            setItems(data.data);
            setNextCursor(data.next_cursor);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setTimeout(() => setContentVisible(true), 50)
            setLoading(false)
        }
    }

    const fetchMoreItems = async () => {
        if (!nextCursor || loading) return;
        try {
            setLoading(true)
            const response = await api.get(searchTerm ? `divisi/search/${searchTerm}` : '/divisi', {
                params: {
                    cursor : nextCursor,
                }
            })
            const data = response.data.data;
            setItems((prevItems) => {
                const existingIds = new Set(prevItems.map(item => item.id));
                const newItems = data.data.filter(item => !existingIds.has(item.id));
                return [...prevItems, ...newItems];
            });
            setNextCursor(data.next_cursor);
        } catch (error) {
            console.error('Error fetching more items:', error);
        } finally {
            setLoading(false)
            setTimeout(() => setContentVisible(true), 80)
        }
       
    }

    const goToUpdate = async(itemId) => {
        const encryptingID = await encrypting(itemId)
        if (encryptingID) {
            navigate(`/divisi/update-divisi/${encryptingID}`)
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

    return(
        <>
        {/* <Transition contentVisible={contentVisible}> */}
            <Navbar title={'Divisi'}/>
            <div className="mx-12 p-12 pt-24 grid grid-cols-6 grid-rows-3 border border-t-0"  style={{ gridTemplateRows: 'auto auto' }}>
                <div className='row-start-1 col-start-1 col-span-full'>
                    <p className='!mt-0 font-bold text-5xl'>Data Divisi</p>
                </div>
                <div className='row-start-2 col-start-1 col-span-4 place-content-center'>
                    <SearchBar disable={loading} onChange={handleSearchChange} values={searchQuery} />
                    {/* <SearchBar /> */}
                </div>
                <div className='row-start-2 col-start-6 place-content-center pl-15'>
                    <button className='rounded-full py-3 !bg-green-600 !hover:bg-green-700 transition-all duration-300'
                            onClick={() => navigate('/divisi/restore-divisi')}>
                        <div className='flex justify-self-center items-center gap-2'>
                            <i class='bx bx-sync bx-rotate-90 bx-xs'></i>
                            <span className='text-sm font-semibold'>Restore Data</span>
                        </div>
                    </button>
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
                                        goToUpdate={goToUpdate}
                                        deleteItems={deleteItems}
                                        belongsTo={'divisi'}
                                        />
                                    )))
                                }
                            </ScrollPagination>
                        </div>
                    </Transition>
                </div>
                <FloatingButton belongsTo='divisi'/>
                    { loading && <Loader Class={'col-span-full'}/> } 
            </div>
        {/* </Transition> */}
        </>
    );
}

export default listDivisi;