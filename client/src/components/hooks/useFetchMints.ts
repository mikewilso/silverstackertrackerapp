import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchMints = () => {
    // Fetch existing mint values from the database
    const [mintOptions, setMintOptions] = useState([
        {
            value: '',
        }
    ]);

    useEffect(() => {
        const fetchMints = async () => {
            try {
                const res = await axios.get('http://localhost:4000/mints');
                let data = res.data;
                const options = data.map((item: any) => ({ value: item.mint }));
                setMintOptions(options);
            } catch (err) {
                console.log(err);
                setMintOptions([{ value: '' }]);
            }
        };
        fetchMints();
    }, []);
    
        return mintOptions;
};