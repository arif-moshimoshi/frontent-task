import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from "../assets/editIcon.svg";
import { deleteApi, getApi } from '../api/apiCalls';
import { BASE_URL } from '../api/apiUrl';
import deleteIcon from "../assets/delete.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from "react-modal";

const TaskList = () => {
    const [taskData, setTaskData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState('ASC'); // State for selected order
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(null);

    const fetchTaskData = async () => {
        try {
            let apiUrl = `${BASE_URL}/tasks`;
            let query = [];

            if (selectedPriority) {
                query.push(`priority=${selectedPriority}`);
            }
            if (selectedOrder) {
                query.push(`order=${selectedOrder}`);
            }
            if (query.length > 0) {
                apiUrl += `?${query.join('&')}`;
            }

            const res = await getApi(apiUrl);
            if (res.status === 200) {
                setTaskData(res?.data?.data);
            }
        } catch (error) {
            console.error("Error fetching task data:", error);
        }
    };

    useEffect(() => {
        fetchTaskData();
    }, [selectedPriority, selectedOrder]);

    const handleEdit = (taskId) => {
        navigate(`/create/${taskId}`, { state: { mode: 'edit' } });
    };

    const handleDeleteButton = (taskId) => {
        setOpenModal(true);
        setDeleteId(taskId);
    };

    const handleDelete = async () => {
        try {
            const res = await deleteApi(`${BASE_URL}/tasks/${deleteId}`);
            if (res.status === 200) {
                toast.success("Deleted successfully");
                fetchTaskData();
                setOpenModal(false);
            }
        } catch (error) {
            console.error("Error while deleting task:", error);
        }
    };

    const handlePriorityChange = (event) => {
        setSelectedPriority(event.target.value);
    };

    const handleOrderChange = (event) => {
        setSelectedOrder(event.target.value);
    };

    return (
        <div className='px-24 py-10 h-screen bg-gray-900 text-white p-6 rounded-lg'>
            <ToastContainer />
            <div className='text-center text-3xl font-bold'>All Task List</div>
            <div className='flex items-center justify-between gap-4 mt-10'>
                <div className='flex gap-4 items-center'>
                    <div>
                        <p className='mb-2'>Priority</p>
                        <select
                            value={selectedPriority || ''}
                            onChange={handlePriorityChange}
                            className='bg-gray-800 rounded-lg border p-3 text-white'
                        >
                            <option value="">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <p className='mb-2'>Order</p>
                        <select
                            value={selectedOrder}
                            onChange={handleOrderChange}
                            className='bg-gray-800 rounded-lg border p-3 text-white'
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
                </div>
                <div>
                    <Link to="/create" className='bg-green-600 rounded-lg p-3 text-white hover:bg-green-500 transition-all'>
                        Create Task
                    </Link>
                </div>
            </div>

            <div className='mt-12 overflow-x-auto'>
                <table className='min-w-full bg-gray-800 text-left'>
                    <thead className='border-b'>
                        <tr>
                            <th className='py-2 px-4'>No.</th>
                            <th className='py-2 px-4'>Heading</th>
                            <th className='py-2 px-4'>Description</th>
                            <th className='py-2 px-4'>Date</th>
                            <th className='py-2 px-4'>Time</th>
                            <th className='py-2 px-4'>Priority</th>
                            <th className='py-2 px-4'>CreatedAt</th>
                            <th className='py-2 px-4'>Image</th>
                            <th className='py-2 px-4'>Edit</th>
                            <th className='py-2 px-4'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskData?.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-700 transition-all border-b border-gray-700">
                                <td className='py-2 px-4'>{index + 1}</td>
                                <td className='py-2 px-4'>{item?.heading}</td>
                                <td className='py-2 px-4'>{item?.description}</td>
                                <td className='py-2 px-4'>{item?.date}</td>
                                <td className='py-2 px-4'>{item?.time}</td>
                                <td className='py-2 px-4'>{item?.priority}</td>
                                <td className='py-2 px-4'>{item?.createdAt}</td>
                                <td className='py-2 px-4'>
                                    <img
                                        src={item?.image}
                                        width={70}
                                        height={70}
                                        className='rounded-lg cursor-pointer'
                                        alt=""
                                    />
                                </td>
                                <td className='py-2 px-4 cursor-pointer' onClick={() => handleEdit(item?.id)}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 19H10H19" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M10.2237 3.82843L13.0522 1L18.0019 5.94975L15.1735 8.77814M10.2237 3.82843L4.61711 9.43504C4.42958 9.62254 4.32422 9.87694 4.32422 10.1421V14.6776H8.85979C9.12499 14.6776 9.37929 14.5723 9.56689 14.3847L15.1735 8.77814M10.2237 3.82843L15.1735 8.77814" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </td>
                                <td className='py-2 px-4 cursor-pointer' onClick={() => handleDeleteButton(item?.id)}>
                                    {/* <img
                                        src={deleteIcon}
                                        className='cursor-pointer'
                                        alt="Delete"
                                        onClick={() => handleDeleteButton(item._id)}
                                    /> */}
                                    <svg width="18" height="20" viewBox="0 0 18 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path id="Vector" d="M17.4255 3.13725H13.4043V2.15686C13.4043 1.58483 13.1823 1.03622 12.7873 0.63173C12.3923 0.22724 11.8565 0 11.2979 0H6.70213C6.14348 0 5.60771 0.22724 5.21269 0.63173C4.81767 1.03622 4.59575 1.58483 4.59575 2.15686V3.13725H0.574468C0.42211 3.13725 0.275991 3.19923 0.168258 3.30955C0.0605241 3.41986 0 3.56948 0 3.72549C0 3.8815 0.0605241 4.03112 0.168258 4.14144C0.275991 4.25175 0.42211 4.31373 0.574468 4.31373H1.53191V18.6275C1.53191 18.9915 1.67314 19.3406 1.92452 19.598C2.1759 19.8554 2.51684 20 2.87234 20H15.1277C15.4832 20 15.8241 19.8554 16.0755 19.598C16.3269 19.3406 16.4681 18.9915 16.4681 18.6275V4.31373H17.4255C17.5779 4.31373 17.724 4.25175 17.8317 4.14144C17.9395 4.03112 18 3.8815 18 3.72549C18 3.56948 17.9395 3.41986 17.8317 3.30955C17.724 3.19923 17.5779 3.13725 17.4255 3.13725ZM5.74468 2.15686C5.74468 1.89685 5.84555 1.64748 6.02511 1.46362C6.20467 1.27976 6.4482 1.17647 6.70213 1.17647H11.2979C11.5518 1.17647 11.7953 1.27976 11.9749 1.46362C12.1544 1.64748 12.2553 1.89685 12.2553 2.15686V3.13725H5.74468V2.15686ZM15.3191 18.6275C15.3191 18.6795 15.299 18.7293 15.2631 18.7661C15.2272 18.8029 15.1784 18.8235 15.1277 18.8235H2.87234C2.82155 18.8235 2.77285 18.8029 2.73694 18.7661C2.70103 18.7293 2.68085 18.6795 2.68085 18.6275V4.31373H15.3191V18.6275ZM7.2766 8.43137V14.7059C7.2766 14.8619 7.21607 15.0115 7.10834 15.1218C7.0006 15.2321 6.85449 15.2941 6.70213 15.2941C6.54977 15.2941 6.40365 15.2321 6.29592 15.1218C6.18818 15.0115 6.12766 14.8619 6.12766 14.7059V8.43137C6.12766 8.27536 6.18818 8.12574 6.29592 8.01543C6.40365 7.90511 6.54977 7.84314 6.70213 7.84314C6.85449 7.84314 7.0006 7.90511 7.10834 8.01543C7.21607 8.12574 7.2766 8.27536 7.2766 8.43137ZM11.8723 8.43137V14.7059C11.8723 14.8619 11.8118 15.0115 11.7041 15.1218C11.5963 15.2321 11.4502 15.2941 11.2979 15.2941C11.1455 15.2941 10.9994 15.2321 10.8917 15.1218C10.7839 15.0115 10.7234 14.8619 10.7234 14.7059V8.43137C10.7234 8.27536 10.7839 8.12574 10.8917 8.01543C10.9994 7.90511 11.1455 7.84314 11.2979 7.84314C11.4502 7.84314 11.5963 7.90511 11.7041 8.01543C11.8118 8.12574 11.8723 8.27536 11.8723 8.43137Z" fill="red" />
                                    </svg>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ReactModal
                isOpen={openModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        maxWidth: '400px',
                        margin: 'auto',
                        border: 'none',
                        maxHeight:'200px',
                        borderRadius: '8px',
                        padding: '20px',
                        background: '#181818',
                        color: '#fff',
                        textAlign: 'center'
                    }
                }}
            >
                <div>
                    <p className='text-lg mb-4'>Are you sure you want to delete?</p>
                </div>
                <div className='flex gap-4 justify-center'>
                    <button
                        onClick={handleDelete}
                        className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-all'
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setOpenModal(false)}
                        className='bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-all'
                    >
                        Close
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

export default TaskList;
