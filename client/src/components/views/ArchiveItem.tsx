import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    Input,
    Modal,
    Table,
    message
        } from 'antd';
import { formData } from '../types';
import { useFetchStack } from '../hooks/useFetchStack';

const { confirm } = Modal;

export const ArchiveItem = () => {
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
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const confirmArchiveItem = async (record: formData) => {
        confirm({
            title: 'Are you sure you want to archive this item?',
            onOk: async () => {
                try {
                    const response = await axios.put(`http://localhost:4000/stack/archive/${record.id}`);
                    setUpdatedData();
                    message.success(response.data);
                } catch (error) {
                    console.error(error);
                }
            },
            onCancel() {
                message.error('Phew, that was a close one!');
                console.log('Cancel');
            },
        });
    };


    useEffect(() => {
        const filterData = async () => {
            const dataArray = await data;
            const filteredData = dataArray.filter((item: { name: string }) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filteredData);
        };
        filterData();
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
            key: 'archive',
            render: (record: formData) => (
                <Button 
                    onClick={() => confirmArchiveItem(record)}
                    type="primary" 
                    danger
                >
                    Archive
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
