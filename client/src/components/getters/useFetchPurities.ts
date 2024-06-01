import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch metals from the database
export const useFetchPurities = () => {
    const [purity, setPurity] = useState([
        {
            id: 0,
            name: '',
            purity: ''
        }
    ]);

    useEffect(() => {
        const fetchPurities = async () => {
            try {
                const res = await axios.get('http://localhost:4000/purities');
                console.log(res.data);
                setPurity(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPurities();
    }, []);

    return purity;
};