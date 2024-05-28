import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    Drawer, 
    Input,
    Table
        } from 'antd';
import { formData } from '../types';
import { EditForm } from '../EditForm';
import { useFetchStack } from '../getters/useFetchStack';

export const EditItem = () => {
    const [drawerOpen, setdrawerOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = React.useState<formData | undefined>();
    let fetchStack = useFetchStack();
    const [data, setData] = useState(fetchStack);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setData(fetchStack);
    }, [fetchStack]);

    const showDrawer = (record: formData) => {
        setCurrentRecord(record);
        setdrawerOpen(true);
    };
    const handleButtonClick = (record: formData) => {
        setCurrentRecord(record);  // Update the currentRecord state
        showDrawer(record);
      };

    const setUpdatedData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/stack');
            console.log("response.data",response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    const onClose = () => {
        setdrawerOpen(false);
        setUpdatedData();
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
                open={drawerOpen}
                width='50vw'
            >
                {currentRecord && (
                    <EditForm currentRecord={currentRecord}/>
                )}

            </Drawer>
            <Input 
                style={{ width: '25%' }} 
                type="text" placeholder="Search" 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}} 
            />
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};
