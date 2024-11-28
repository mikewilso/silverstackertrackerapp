import React, { FC, useEffect, useState } from 'react';
import { 
    Card,
    Col,
    Input,
    Row,
    Spin } from 'antd';
import axios from 'axios';

const { Search } = Input;

export const TheStack: FC = () => {
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
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStack = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack');
                console.log(res.data);
                setStack(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStack();
    }, []);

    const filteredStack = stack.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.description.toLowerCase().includes(filterText.toLowerCase())
    );

    return <div>
        <Search
                placeholder="Search stack"
                onChange={e => setFilterText(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div className='stackList'>
                    <Row gutter={16}>
                        {filteredStack.map((item) => (
                            <Col key={item.id} span={6}>
                                <Card 
                                    title={item.name} 
                                    bordered={true}
                                    hoverable={true}
                                    cover={<img alt="example" src={`http://localhost:4000/image/${item.imagefileid}`} />}
                                >
                                    {item.description}
                                </Card>                      
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
    </div>;
};
