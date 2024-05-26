import React, { FC, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';


export const EditItem: FC = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStack = async () => {
            try {
                const response = await axios.get('http://localhost:4000/stack');
                console.log("response.data",response.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchStack();
    }, []);

    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredData = data.filter((data: { name: string }) =>
            data.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Handle button click,
    const handleButtonClick = (record: object) => {
            console.log(record);
            // Handle button click here
            alert('Edit button clicked');
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imagefileid', 
            key: 'image',
            render: (imagefileid: string) => <img src={`http://localhost:4000/image/${imagefileid}`} alt="item" style={{width: '50px', height: '50px'}}/> // adjust the style as needed
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
            key: 'edit',
            render: (text: any, record: any) => (
                <Button onClick={() => handleButtonClick(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <div>
            <input type="text" placeholder="Search" onChange={event => {setSearchTerm(event.target.value)}} />
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};
