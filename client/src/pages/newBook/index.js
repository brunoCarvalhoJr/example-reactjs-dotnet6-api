import React, { useState, useEffect} from "react";
import './style.css'
import logoImage from '../../assets/logo.svg'
import { Link } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi'

import { useNavigate, useParams } from 'react-router-dom'

import api from '../../services/api'


export default function NewBook() {

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [launchDate, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');
    
    const [id, setId] = useState(null);

    const { bookId } = useParams();

    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if(bookId === '0') return
        else loadBook();
    }, [bookId])

    async function loadBook() {
        try {
            const response = await api.get(`/api/Book/v1/${bookId}`, authorization);

            let ajusteDate = response.data.launchDate.split("T", 10)[0]

            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLaunchDate(ajusteDate);

        } catch (error) {
            alert("Error recovering Book! try again!");
            navigate('/books')
        }
    }

    async function saveOrUpdate(e) {
        e.preventDefault();

        const data = {
            author,
            title,
            launchDate,
            price
        }

        try {
            if(bookId === '0'){
                await api.post('/api/Book/v1', data, authorization);
            }else {
                data.id = id
                await api.put('/api/Book/v1', data, authorization);
            }

            navigate('/books');
        } catch (error) {
            alert("Error While Recording book, try again!");
        }
    }

    return (
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={logoImage} alt="Erudio"/>
                    <h1>{bookId === '0' ? 'Add new '  : 'Update ' } Book</h1>
                    <p>Enter the book information and click on {bookId === '0' ? 'Add' : 'Update'}!</p>
                    <Link className="back-link" to="/books">
                        <FiArrowLeft size={16} color="#251fc5"/>
                        Back to books
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input 
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input 
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <input 
                        type={'date'}
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                    />
                    <input 
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <button className="button" type="submit">{bookId === '0' ? 'Add' : 'Update'}</button>
                </form>
            </div>
        </div>
    )
}