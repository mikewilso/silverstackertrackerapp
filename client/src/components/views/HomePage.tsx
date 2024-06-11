import React, { useEffect, useState } from 'react';
import { 
    Card,
    Col, 
    Row, 
    Typography } from 'antd';
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
            imagefileid: 0,
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
                <Title level={3}>TOTAL GOLD: {totalGoldWeights} OZT</Title>
                <Title level={3}>TOTAL SILVER: {totalSilverWeights} OZT</Title>
                <Title level={3}>TOTAL COPPER: {totalCopperWeights} OZT</Title>
            </div>
            <div className='stackList'>
            <Row gutter={16}>
                {stack.map((item) => (
                    <Col key={item.id} span={6}>
                        <Card 
                            title={item.name} 
                            bordered={true}
                            cover={<img alt="example" src={`http://localhost:4000/image/${item.imagefileid}`} />}
                        >
                            {item.description}
                        </Card>                      
                    </Col>
                ))}
            </Row>
            </div>
        </div>
    );
};