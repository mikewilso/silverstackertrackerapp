import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchItemForms = () => {
    const [itemForms, setItemForms] = useState([
        {
            id: 0,
            itemformvalue: '',
            itemformtype: ''
        }
    ]);

    useEffect(() => {
        const fetchItemForms = async () => {
            try {
                const res = await axios.get('http://localhost:4000/itemforms');
                console.log(res.data);
                setItemForms(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchItemForms();
    }, []);

    return itemForms;
};