import React, { FC, useEffect, useState } from 'react';
import { 
    Card,
    Col,
    Input,
    Modal,
    Row,
    Spin } from 'antd';
import axios from 'axios';
import { format } from 'date-fns';

const { Search } = Input;

interface SelectedItem {
    id: string;
    name: string;
    description: string;
    purchasedate: string;
    metaltype: string;
    weight: number;
    amount: number;
    imagefileid: number;
}

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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

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

    const showModal = (item: SelectedItem) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
                                    onClick={() => showModal(item)}
                                >
                                    {item.description}
                                </Card>                      
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        <Modal
            title={selectedItem?.name}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            {selectedItem && (
                <div>
                    <script>console.log(selectedItem)</script>
                    <p><strong>Description:</strong> {selectedItem.description}</p>
                    <p><strong>Purchase Date:</strong> {selectedItem ? format(new Date(selectedItem.purchasedate), "MMMM do, yyyy") : ''}</p>
                    <p><strong>Metal Type:</strong> {selectedItem.metaltype}</p>
                    <p><strong>Weight:</strong> {selectedItem.weight}</p>
                    <p><strong>Amount:</strong> {selectedItem.amount}</p>
                    <img alt="example" src={`http://localhost:4000/image/${selectedItem.imagefileid}`} style={{ width: '100%' }} />
                </div>
            )}
        </Modal>
    </div>;
};
