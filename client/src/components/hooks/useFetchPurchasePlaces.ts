  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  // Fetch existing purchase place values from the database for the AutoComplete component
export const useFetchPurchasePlaces = () => {
    const [purchasePlaces, setPurchasePlaces] = useState([
        {
            value: '',
        }
    ]);

    useEffect(() => {
        const fetchPurchasePlaces = async () => {
            try {
                const res = await axios.get('http://localhost:4000/purchasedfrom');
                let data = res.data;
                const options = data.map((item: any) => ({ value: item.purchasedfrom }));
                setPurchasePlaces(options);
            } catch (err) {
                console.log(err);
                setPurchasePlaces([{ value: '' }]);
            }
        };
        fetchPurchasePlaces();
    }, []);

    return purchasePlaces;
};
