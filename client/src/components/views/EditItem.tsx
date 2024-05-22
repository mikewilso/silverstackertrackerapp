import React, { FC, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';

export const EditItem: FC = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStack = async () => {
            try {
                const response = await axios.get('http://localhost:4000/stack');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchStack();
    }, []);

    const handleButtonClick = (record: object) => {
        console.log(record);
        // Handle button click here
    };

    const columns = [
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
            title: 'Shape',
            dataIndex: 'shape',
            key: 'shape',
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
            key: 'edit',
            render: (text: any, record: any) => (
                <Button onClick={() => handleButtonClick(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};
