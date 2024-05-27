import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch metals from the database
export const useFetchMetals = () => {
    const [metals, setMetals] = useState([
        {
            id: 0,
            metalvalue: '',
            metaltype: ''
        }
    ]);

    useEffect(() => {
        const fetchMetals = async () => {
            try {
                const res = await axios.get('http://localhost:4000/metals');
                console.log(res.data);
                setMetals(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMetals();
    }, []);

    return metals;
};