import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/Backbutton'
import Spinner from '../components/Loading'

const CreateBook = () => {
  const [title, setTitle] = useState('')            
  const [author, setAuthor] = useState('')
  const [publishYear, setPublishYear] = useState('')
  const [price,setprice]=useState(0);
  const [copies, setCopies] = useState(0) 
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSaveBook = () => {
    const data = { title, author, publishYear, price,copies } 
    setLoading(true)
    
    axios.post('http://localhost:5555/books', data)
      .then(() => {
        setLoading(false)
        navigate('/home')
      })
      .catch((error) => {
        setLoading(false)
        alert('An error happened. Please check the console.')
        console.log(error)
      })
  }

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input name="title"type='text' value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input name="author" type='text' value={author} onChange={(e) => setAuthor(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input name="publishYear"type='number' value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Price</label>
          <input name="price"type='number' onChange={(e) => setprice(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Number of Copies</label>
          <input name="copies" type='number' value={copies} onChange={(e) => setCopies(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' min="0" />
        </div>
  
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveBook}>Save</button>
      </div>
    </div>
  )
}

export {CreateBook}