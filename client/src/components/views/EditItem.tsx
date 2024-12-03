import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    Col,
    Drawer,
    Image, 
    Input,
    message,
    Modal,
    Row,
    Switch,
    Table } from 'antd';
import { formData } from '../../types/types';
import { EditForm } from '../EditForm';
import { useFetchStack } from '../hooks/useFetchStack';

const { confirm } = Modal;

export const EditItem = () => {
    let fetchStack = useFetchStack();

    const [drawerOpen, setdrawerOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = React.useState<formData | undefined>();
    const [data, setData] = useState(fetchStack);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editArchiveToggle, setEditArchiveToggle] = useState(true);

    useEffect(() => {
        setData(fetchStack);
        setIsLoading(false);
    }, [fetchStack]);

    const showDrawer = (record: formData) => {
        setCurrentRecord(record);
        setdrawerOpen(true);
    };
    const handleEditButtonClick = (record: formData) => {
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
    
    const getEditArchiveToggle = () => {
        return (
            <Switch
                checked={editArchiveToggle}
                onChange={() => setEditArchiveToggle(!editArchiveToggle)}
                checkedChildren="Edit"
                unCheckedChildren="Archive"
            />
        )
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
            const dataArray = data;
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
                <Image 
                    width={50} 
                    height={50}
                    src={`http://localhost:4000/image/${imagefileid}`} 
                    alt="item"
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
            dataIndex: 'formtype',
            key: 'formtype',
            render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),

        },
        {
            title: 'Metal',
            dataIndex: 'metaltype',
            key: 'metaltype',
            render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),

        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a:any, b:any) => a.amount - b.amount,
        },
        {
            title: getEditArchiveToggle(),
            key: 'edit',
            render: (record: formData) => (
                editArchiveToggle ? 
                    <Button onClick={() => handleEditButtonClick(record)} type="primary">Edit</Button> : 
                    <Button onClick={() => confirmArchiveItem(record)} type="primary" danger>Archive</Button>
            ),
        },
    ];

    return (
        <div>
            <Drawer
                title={`Edit Item: ${currentRecord?.name}`}
                placement="right"
                closable={false}
                onClose={onClose}
                open={drawerOpen}
                width='50vw'
            >
                {currentRecord && (
                    <EditForm currentRecord={currentRecord} onEditSuccess={onClose}/>
                )}

            </Drawer>
            <Row>
                <Col span={20}>
                    <Input
                        style={{ width: '25%' }} 
                        type="text" placeholder="Search" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}} 
                    />
                </Col>
            <Col span={4}>
            </Col>
            </Row>
            <br />
            <Table columns={columns} dataSource={filteredData} loading={isLoading}/>   
        </div>
    );
};
