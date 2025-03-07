import Navbar from '../kit/customNavbar';
import SearchBar from '../kit/SearchBar';
import ScrollPagination from '../kit/scrollPagination';
import DepartmentCards from '../kit/cards/departmentCards';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Transition from '../kit/Transition';
import Loader from '../kit/Loader';
import api from '../../api/api';
import Swal from 'sweetalert2';

function restoreDepartment(){
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
            const response = await api.get(searchTerm ? `departmentTrash/${searchTerm}` : `department/trash`) 
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
            const response = await api.get(searchTerm ? `departmentTrash/${searchTerm}` : `department/trash`, {
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
              await api.get(`/department/restore/${id}`);
              setItems(items.filter((item) => item.id !== id));
              await Swal.fire('Berhasil!', '', 'success');
            }
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Merestore Department',
                text:'Ada Kesalahan Dalam Sistem'
            })
        }
    }

    return(
        <>
        {/* <Transition contentVisible={contentVisible}> */}
            <Navbar title={'Department'}/>
            <div className="mx-12 p-12 pt-24 grid grid-cols-6 grid-rows-3 border border-t-0"  style={{ gridTemplateRows: 'auto auto' }}>
                <div className='row-start-1 col-start-1 col-span-full'>
                    <a onClick={() => navigate('/department')}>back</a>
                    <p className='!mt-2 font-bold text-5xl'>Restore Department</p>
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
                                        belong={'department'}
                                        />
                                    )))
                                }
                            </ScrollPagination>
                        </div>
                    </Transition>
                </div>
                    { loading && <Loader Class={'col-span-full'}/> } 
            </div>
        {/* </Transition> */}
        </>
    );
}

export default restoreDepartment;