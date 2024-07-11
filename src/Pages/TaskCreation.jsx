import React, { useEffect, useState } from 'react';
import { getApi, postFormDataApi, putFormDataApi } from '../api/apiCalls';
import { BASE_URL } from '../api/apiUrl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

function TaskCreation({ mode }) {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        date: '',
        time: '',
        priority: 'low',
        image: null,
        imageUrl: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && taskId) {
            fetchTaskData();
        }
    }, [mode, taskId]);

    const fetchTaskData = async () => {
        try {
            const res = await getApi(`${BASE_URL}/tasks/${taskId}`);
            if (res.status === 200) {
                const taskData = res.data.data;
                setFormData({
                    heading: taskData.heading,
                    description: taskData.description,
                    date: taskData.date,
                    time: taskData.time,
                    priority: taskData.priority,
                    image: null,
                    imageUrl: taskData.image, // Store image URL for display/edit
                });
            }
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            // Handle image file separately
            setFormData({
                ...formData,
                image: files ? files[0] : null,
                imageUrl: '', // Clear imageUrl when new image is selected
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.heading) newErrors.heading = 'Heading is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.priority) newErrors.priority = 'Priority is required';
        if (!formData.image && mode === 'create') newErrors.image = 'Image is required'; // Only validate image if creating new task
        if (!formData.image && mode === 'edit' && !formData.imageUrl) newErrors.image = 'Image is required'; // Only validate image if creating new task
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }        
        const { heading, description, date, time, priority, image } = formData;
        const formDataObj = new FormData();
        formDataObj.append('heading', heading);
        formDataObj.append('description', description);
        formDataObj.append('date', date);
        formDataObj.append('time', time);
        formDataObj.append('priority', priority);
        if (image) {
            formDataObj.append('image', image); // Append new image if modified
        }
    
        try {
            let response;
            if (mode === 'edit') {
                // Update existing task
                response = await putFormDataApi(`${BASE_URL}/tasks/${taskId}`, formDataObj);
            } else {
                // Create new task
                response = await postFormDataApi(`${BASE_URL}/tasks`, formDataObj);
            }
    
            if (response.status === 200) {
                setFormData({
                    heading: '',
                    description: '',
                    date: '',
                    time: '',
                    priority: 'low',
                    image: null,
                    imageUrl: '', 
                });
                toast.success(`${mode === 'edit' ? 'Task updated' : 'Task created'}`);
                navigate('/');
            } else {
                toast.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} task: ${response.statusText}`);
                console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} task: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} task:`, error);
        }
    };

    return (
        <div className='mx-auto max-w-screen-md'>
            <ToastContainer />

            <div className='flex justify-center my-10'>
                <div className='text-center text-3xl font-bold text-white bg-green-500 rounded-md p-3'>
                    {mode === 'create' ? 'Create Task' : 'Edit Task'}
                </div>
            </div>
            <div className='bg-gray-900 p-10 rounded-md mt-10'>
                <form className='text-white flex items-center flex-col' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='heading'>Heading:</label>
                        <br />
                        <input
                            type='text'
                            id='heading'
                            name='heading'
                            value={formData.heading}
                            onChange={handleChange}
                            className={`border rounded-lg py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.heading ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.heading && <p className='text-red-500'>{errors.heading}</p>}
                    </div>
                    <div className='form-group mt-5'>
                        <label htmlFor='description'>Description:</label>
                        <br />
                        <textarea
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            className={`border rounded-lg py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.description && <p className='text-red-500'>{errors.description}</p>}
                    </div>
                    <div className='form-group mt-5'>
                        <label htmlFor='date'>Date:</label>
                        <br />
                        <input
                            type='date'
                            id='date'
                            name='date'
                            value={formData.date}
                            onChange={handleChange}
                            className={`border rounded-lg py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.date && <p className='text-red-500'>{errors.date}</p>}
                    </div>
                    <div className='form-group mt-5'>
                        <label htmlFor='time'>Time:</label>
                        <br />
                        <input
                            type='time'
                            id='time'
                            name='time'
                            value={formData.time}
                            onChange={handleChange}
                            className={`border rounded-lg py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.time && <p className='text-red-500'>{errors.time}</p>}
                    </div>
                    <div className='form-group mt-5'>
                        <label htmlFor='priority'>Priority:</label>
                        <br />
                        <select
                            id='priority'
                            name='priority'
                            value={formData.priority}
                            onChange={handleChange}
                            className={`border p-2 rounded-lg w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.priority ? 'border-red-500' : 'border-black'}`}
                        >                            
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                        {errors.priority && <p className='text-red-500'>{errors.priority}</p>}
                    </div>
                    <div className='form-group mt-5'>
                        <label htmlFor='image'>Image:</label>
                        <br />
                        {formData.imageUrl && (
                            <div className='flex items-center max-w-[400px]'>
                                <span className='mr-2 text-white'>{formData.imageUrl}</span>
                                <button
                                    type='button'
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'
                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                        {!formData.imageUrl && (
                            <input
                                type='file'
                                id='image'
                                name='image'
                                accept='image/*'
                                onChange={handleChange}
                                className={`border rounded-lg py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:border-green-500 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        )}
                        {errors.image && <p className='text-red-500'>{errors.image}</p>}
                    </div>
                    <div className='my-4'>
                        <button
                            type='submit'
                            className='border border-black rounded-lg px-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:shadow-outline transition-all duration-400'
                        >
                            {mode === 'edit' ? 'UPDATE' : 'SAVE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskCreation;
