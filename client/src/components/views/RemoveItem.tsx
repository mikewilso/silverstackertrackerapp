import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    Input,
    Modal,
    Table
        } from 'antd';
import { formData } from '../types';
import { useFetchStack } from '../getters/useFetchStack';
import { on } from 'events';
const { confirm } = Modal;

export const RemoveItem = () => {
    const [currentRecord, setCurrentRecord] = React.useState<formData | undefined>();
    let fetchStack = useFetchStack();
    const [data, setData] = useState(fetchStack);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setData(fetchStack);
    }, [fetchStack]);

    const setUpdatedData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/stack');
            console.log("response.data",response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const confirmRemoval = async (record: formData) => {
        confirm({
            title: 'Are you sure you want to delete this item?',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:4000/stack/remove/${record.id}`);
                    console.log(response.data);
                    setUpdatedData();
                } catch (error) {
                    console.error(error);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    useEffect(() => {
        const filteredData = data.filter((item: { name: string }) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filteredData);
    }, [data, searchTerm]);


    const columns = [
        {
            title: 'Image',
            dataIndex: 'imagefileid', 
            key: 'image',
            render: (imagefileid: string) => 
                <img 
                    src={`http://localhost:4000/image/${imagefileid}`} 
                    alt="item" style={{width: '50px', height: '50px'}}
                /> 
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Mint',
            dataIndex: 'mint',
            key: 'mint',
        },
        {
            title: 'Form',
            dataIndex: 'form',
            key: 'form',
        },
        {
            title: 'Metal Type',
            dataIndex: 'metaltype',
            key: 'metaltype',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '',
            key: 'remove',
            render: (record: formData) => (
                <Button 
                    onClick={() => confirmRemoval(record)}
                    type="primary" 
                    danger
                >
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Input 
                style={{ width: '25%' }} 
                type="text" placeholder="Search" 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}} 
            />
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};
