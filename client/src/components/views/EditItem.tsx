import React, { useEffect, useState } from 'react';
import { 
    Button,
    Drawer, 
    Input,
    Table
        } from 'antd';
import axios from 'axios';
import { formData } from '../interfaces';
import { EditForm } from '../EditForm';

export const EditItem = () => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = React.useState<formData | undefined>();

    const showDrawer = (record: formData) => {
        setCurrentRecord(record);
        setDrawerVisible(true);
    };
    const handleButtonClick = (record: formData) => {
        setCurrentRecord(record);  // Update the currentRecord state
        showDrawer(record);
      };
      
    const onClose = () => {
        setDrawerVisible(false);
    };

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
            key: 'edit',
            render: (record: formData) => (
                <Button onClick={() => handleButtonClick(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <div>
            <Drawer
                //TODO: Add name of item to the drawer title
                title="Edit Item"
                placement="right"
                closable={false}
                onClose={onClose}
                open={drawerVisible}
                width='50vw'
            >
                {currentRecord && (
                    <EditForm currentRecord={currentRecord}/>
                )}

            </Drawer>
            <Input style={{ width: '25%' }} type="text" placeholder="Search" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}} />
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};
