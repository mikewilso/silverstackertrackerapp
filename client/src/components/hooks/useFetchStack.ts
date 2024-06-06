import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchStack = async () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStack = async () => {
            try {
                const response = await axios.get('http://localhost:4000/stack');
                console.log("response.data",response.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setData([]);
            }
        };

        fetchStack();
    }, []);
    
    return data;
};