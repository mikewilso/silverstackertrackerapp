import { useEffect, useState } from 'react';
import axios from 'axios';

// Fetch existing item name values from the database for the AutoComplete component
export const useFetchItemNames = () => {
  const [itemNames, setItemNames] = useState([
      {
          name: '',
      }
  ]);

  useEffect(() => {
      const fetchItemNames = async () => {
          try {
              const res = await axios.get('http://localhost:4000/itemnames');
              let data = res.data;
              const options = data.map((item: any) => ({ value: item.name }));
              setItemNames(options);
          } catch (err) {
              console.log(err);
              setItemNames([{ name: '' }]);
          }
      };
      fetchItemNames();
  }, []);

  return itemNames;
};
