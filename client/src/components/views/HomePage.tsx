import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

export const HomePage = () => {

    const [totalGoldWeights, setTotalGoldWeights] = useState(0);
    const [totalSilverWeights, setTotalSilverWeights] = useState(0);
    const [totalCopperWeights, setTotalCopperWeights] = useState(0);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/silver');
                setTotalSilverWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/gold');
                setTotalGoldWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/copper');
                setTotalCopperWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);
    
    const [stack, setStack] = useState([
        {
            id: '',
            name: '',
            description: '',
            purchasedate: '',
            metaltype: '',
            weight: 0,
            amount: 0,
        },
    ]);

    useEffect(() => {
        const fetchStack = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack');
                console.log(res.data);
                setStack(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchStack();
    }, []);



    return (
        <div>
            <Title>Michael's Home Page</Title>
            <div>
                <Title>TOTAL GOLD: {totalGoldWeights} OZT</Title>
                <Title>TOTAL SILVER: {totalSilverWeights} OZT</Title>
                <Title>TOTAL COPPER: {totalCopperWeights} OZT</Title>
            </div>
            <div className='stackList'>
                {stack.map((item) => (
                    <div className='item' key={item.id}>
                        <h1>{item.name}</h1>
                        <ul>
                            <li>{item.description}</li>
                            <li>{item.purchasedate}</li>
                            <li>{item.metaltype}</li>
                            <li>{item.weight}</li>
                            <li>{item.amount}</li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};