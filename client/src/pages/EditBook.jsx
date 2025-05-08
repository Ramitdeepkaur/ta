import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/Backbutton'
import Spinner from '../components/Loading'

const EditBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publishYear, setPublishYear] = useState('')
  const [price,setprice]=useState(0)
  const [copies, setCopies] = useState(0) 
  const [sold, setsold] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setAuthor(response.data.author)
        setPublishYear(response.data.publishYear)
        setTitle(response.data.title)
        setprice(response.data.price)
        setsold(response.data.sold)
        setCopies(response.data.copies) 
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        alert('An error happened. Please check the console.')
        console.log(error)
      })
  }, [])

  const handleEditBook = () => {
    const data = { title, author, publishYear,price, copies } 
    setLoading(true)

    axios.put(`http://localhost:5555/books/${id}`, data)
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
      <h1 className='text-3xl my-4'>Edit Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input type='text' value={author} onChange={(e) => setAuthor(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input type='number' value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Price</label>
          <div className='flex items-center gap-2'>
            {/* <button className='p-2 bg-gray-300' onClick={() => setprice(Math.max(0, price - 1))}>-</button> */}
            <input type='number' name="price" value={price} onChange={(e) => setprice(Number(e.target.value))} className='border-2 border-gray-500 px-4 py-2 w-full' min="1" />
            {/* <button className='p-2 bg-gray-300' onClick={() => setprice(price + 1)}>+</button> */}
          </div>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Number of Copies</label>
          <div className='flex items-center gap-2'>
            <button className='p-2 bg-gray-300' onClick={() => setCopies(Math.max(0, copies - 1))}>-</button>
            <input type='number' value={copies} onChange={(e) => setCopies(Number(e.target.value))} className='border-2 border-gray-500 px-4 py-2 w-full' min="0" />
            <button className='p-2 bg-gray-300' onClick={() => setCopies(copies + 1)}>+</button>
          </div>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Copies sold</label>
          <div className='flex items-center gap-2'>
            <button className='p-2 bg-gray-300' onClick={() => setsold(Math.max(0, copies - 1))}>-</button>
            <input type='number' value={sold} onChange={(e) => setsold(Number(e.target.value))} className='border-2 border-gray-500 px-4 py-2 w-full' min="0" />
            <button className='p-2 bg-gray-300' onClick={() => setsold(sold + 1)}>+</button>
          </div>
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditBook}>Save</button>
      </div>
    </div>
  )
}

export {EditBook}