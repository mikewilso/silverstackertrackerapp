import React, { FC, useEffect, useState } from 'react';
import { Button, Drawer, Input, Table } from 'antd';
import axios from 'axios';

interface formData {
    name: string;
    description: string;
    purchasedate: string;
    purchasedfrom: string;
    purchaseprice: number;
    form: string;
    mint: string;
    metaltype: string;
    purity: number;
    weighttype: string;
    unitweight: number;
    ozweight: number;
    oztweight: number;
    gramweight: number;
    ozweightpure: number;
    oztweightpure: number;
    gramweightpure: number;
    amount: number;
    totalpureozweight: number;
    totalpureoztweight: number;
    totalpuregramweight: number;
    imagefileid: number;
}


export const EditItem: FC = () => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<formData | null>(null);
    const showDrawer = (record: formData) => {
        setCurrentRecord(record);
        setDrawerVisible(true);
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

    // Handle button click,
    const handleButtonClick = (record: formData) => {
            console.log(record);
            showDrawer(record);
    };

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
            render: (text: string, record: formData) => (
                <Button onClick={() => handleButtonClick(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <div>
            <Drawer
                title="Edit Item"
                placement="right"
                closable={false}
                onClose={onClose}
                open={drawerVisible}
                width='50vw'
            >
            {currentRecord && (
                <div>
                    <p>{currentRecord.name}</p>
                    <p>{currentRecord.description}</p>
                    <p>{currentRecord.purchasedate}</p>
                    <p>{currentRecord.purchasedfrom}</p>
                    <p>{currentRecord.purchaseprice}</p>
                    <p>{currentRecord.form}</p>
                    <p>{currentRecord.mint}</p>
                    <p>{currentRecord.metaltype}</p>
                    <p>{currentRecord.purity}</p>
                    <p>{currentRecord.weighttype}</p>
                    <p>{currentRecord.unitweight}</p>
                    <p>{currentRecord.ozweight}</p>
                    <p>{currentRecord.oztweight}</p>
                    <p>{currentRecord.gramweight}</p>
                    <p>{currentRecord.ozweightpure}</p>
                    <p>{currentRecord.oztweightpure}</p>
                    <p>{currentRecord.gramweightpure}</p>
                    <p>{currentRecord.amount}</p>
                    <p>{currentRecord.totalpureozweight}</p>
                    <p>{currentRecord.totalpureoztweight}</p>
                    <p>{currentRecord.totalpuregramweight}</p>
                    <p>{currentRecord.imagefileid}</p>
                </div> 
                )} 
            </Drawer>
            <Input style={{ width: '25%' }} type="text" placeholder="Search" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}} />
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};
