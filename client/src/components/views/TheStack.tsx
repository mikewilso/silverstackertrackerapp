import React, { FC, useEffect, useState } from 'react';
import { 
    Card,
    Col,
    Divider,
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
    purchasedfrom: string;
    purchaseprice: number;
    metaltype: string;
    formtype: string;
    mint: string;
    oztweight: number;
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
            purchasedfrom: '',
            purchaseprice: 0,
            metaltype: '',
            formtype: '',
            mint: '',
            oztweight: 0,
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
                    <Divider />
                </div>
            )}
        <Modal
            title={selectedItem?.name}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            {selectedItem && (
                <div>
                    <Divider />
                    <img alt={selectedItem.name} src={`http://localhost:4000/image/${selectedItem.imagefileid}`} style={{  display: 'block', margin: 'auto', width: '400px' }} />
                    <p style={{ textAlign: 'center' }}><i>{selectedItem.description}</i></p>
                    <Divider />
                    <Row>
                        <Col span={8}>
                            <p><strong>Purchased:</strong> {selectedItem ? format(new Date(selectedItem.purchasedate), "MMMM do, yyyy") : ''}</p>
                        </Col>
                        <Col span={8}>
                            <p><strong>Purchased From:</strong> {selectedItem.purchasedfrom}</p>
                        </Col>
                        <Col span={8}>
                            <p><strong>Purchase Price:</strong> ${selectedItem.purchaseprice}</p>
                        </Col>
                    </Row>
                    <p><strong>Metal Type:</strong> {selectedItem ? selectedItem.metaltype.charAt(0).toUpperCase() + selectedItem.metaltype.slice(1) : ''}</p>                    
                    <p><strong>Form:</strong> {selectedItem.formtype}</p>
                    <p><strong>Mint:</strong> {selectedItem.mint}</p>
                    <p><strong>Weight:</strong> {selectedItem.oztweight}</p>
                    <p><strong>Amount:</strong> {selectedItem.amount}</p>
                </div>
            )}
        </Modal>
    </div>;
};
