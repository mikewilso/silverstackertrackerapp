import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    AutoComplete,
    Button,  
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Radio,
    Select,
    Tooltip,
    Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { formData } from './types';
import { useFetchMetals } from './getters/useFetchMetals'
import { useFetchItemForms } from './getters/useFetchItemForms'
import { useFetchPurchasePlaces } from './getters/useFetchPurchasePlaces'
import { useFetchMints } from './getters/useFetchMints'
import { handleAddDataFields } from './helpers/useDataConversions';

type EditFormProps = {
    currentRecord: formData;
}

// TODO: Add ability to change the image file
export const EditForm = ({ currentRecord }: EditFormProps) => {
    const [form] = Form.useForm();
    const [pictureId, setPictureId] = useState(null);
    const [recordId, setRecordId] = useState({id: 0});
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setRecordId({ id: currentRecord.id });
        setImageUrl(`http://localhost:4000/image/${currentRecord.imagefileid}`);
    }, [currentRecord]);

    const onFinish = async (values: any) => {
        try {
            await handleAddDataFields(values).then(async (updatedValues) => {
                console.log("pictureid", pictureId);
                // Update the imagefileid with the new pictureId or keep the current imagefileid
                updatedValues.imagefileid = pictureId || currentRecord.imagefileid;
                console.log('Updated values:', updatedValues);
                const response = await axios.put(`http://localhost:4000/stack/${recordId.id}`, updatedValues);
                console.log('Updated record:', response.data);
            });
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    useEffect(() => {
        console.log('Current record:', currentRecord);
        currentRecord.purchasedate = currentRecord.purchasedate.split('T')[0];
        form.setFieldsValue(currentRecord);
    }, [currentRecord, form]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image 
                    src={imageUrl}
                    width={250} 
                    height={250}
                />
                <Upload 
                    name= 'imagefile'
                    action = 'http://localhost:4000/upload'
                    multiple = {false}
                    accept=".jpg,.jpeg,.png"
                    onChange = {(info: any) => {
                        const { status } = info.file;
                        console.log("INFO", info.file, info.fileList)
                        if (status !== 'uploading') {
                            console.log("info file response",info.file.response.imageId);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} file uploaded successfully.`);
                            // Update pictureId with the image id from the server response
                            setPictureId(info.file.response.imageId);
                            // Update imageUrl with the URL of the uploaded image
                            setImageUrl(`http://localhost:4000/image/${info.file.response.imageId}`);
                
                        } else if (status === 'error') {
                            message.error(`${info.file.name} file upload failed.`);
                        }
                    }
                }
                >
                    <Button icon={<UploadOutlined />}>Change Picture</Button>
                </Upload>
            </div>
            <br />
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="imagefileid"
                    hidden
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <Input.TextArea placeholder="Enter item description (optional)" />
                </Form.Item>

                <Form.Item 
                        label='Purchase Date' 
                        name='purchasedate'
                        rules={[{ required: true, message: 'Please select the purchase date!' },
                        { pattern: /^\d{4}-\d{2}-\d{2}$/, message: 'Please enter a date in the format YYYY-MM-DD!' }]}
                        style={{ width: '35%' }}
                        
                    >
                        <Input  placeholder='YYYY-MM-DD'/>
                </Form.Item>

                <Form.Item 
                    label='Purchased From' 
                    name='purchasedfrom'
                    rules={[{ required: true, message: 'Please input where it was purchased from!' }]}
                >
                    <AutoComplete
                        options={useFetchPurchasePlaces()}
                        placeholder='Enter place of purchase(coin shop, APMEX, etc.)'
                        filterOption={(inputValue: string, option: any) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                </Form.Item>

                <Form.Item 
                    label={
                        <span>
                            Unit Price <Tooltip title="Price per unit at time of purchase.">
                                            <InfoCircleOutlined />
                                        </Tooltip>
                        </span>
                    }
                    name='purchaseprice'
                    rules={[{ required: true, message: 'Please input the purchase price!' }]}
                >
                    <InputNumber
                        min={0} 
                        prefix={<span style={{ color: 'rgba(0,0,0,.25)' }}>$</span>}
                        style={{ width: '25%' }}
                        placeholder='0.00'
                    />
                </Form.Item>

                <Form.Item 
                    label='Form' 
                    name='form' 
                    rules={[{ required: true, message: 'Please input the form of the metal!' }]}
                >
                    <Select placeholder='Select the form of the item'>
                        {useFetchItemForms().map((itemform)=>(
                            <Select.Option value={itemform.itemformvalue}>{itemform.itemformtype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    label='Mint' 
                    name='mint'
                    rules={[{ required: true, message: 'Please input the maker of this item!' }]}
                >
                    <AutoComplete
                        options={useFetchMints()}
                        placeholder='Enter maker of the item'
                        filterOption={(inputValue: string, option: any) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                </Form.Item>

                <Form.Item 
                    label='Metal Type' 
                    name='metaltype'
                    rules={[{ required: true, message: 'Please choose the precious metal type!' }]}
                >
                    <Select placeholder='Enter metal type'>
                        {useFetchMetals().map((metal)=>(
                            <Select.Option value={metal.metalvalue}>{metal.metaltype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    label='Unit Weight' 
                    name='unitweight'
                    rules={[{ required: true, message: 'Please input the weight!' }]}>
                    <InputNumber min={0.01} placeholder='0.01'/>
                </Form.Item>
           
                <Form.Item 
                    label='Unit of Weight' 
                    name='weighttype'
                    rules={[{ required: true, message: 'Please choose the unit of weight!' }]}>
                    <Radio.Group>
                        <Radio value='ozt'>Troy Ounces</Radio>
                        <Radio value='oz'>Ounces</Radio>
                        <Radio value='grams'>Grams</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item 
                    label='Purity' 
                    name='purity'
                    rules={[{ required: true, message: 'Please input the purchase price!' }]}>                    
                    <Select placeholder='Select purity of item'>
                        <Select.Option value='1'>Pure(.999)</Select.Option>
                        <Select.Option value='0.925'>Sterling(.925)</Select.Option>
                        <Select.Option value='0.9'>Coin(90%)</Select.Option>
                        <Select.Option value='0.958'>Britannia(95.8%)</Select.Option>
                        <Select.Option value='0.8'>Sterling(.800)</Select.Option>
                        <Select.Option value='0.35'>War Nickel(35%)</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item 
                    label='Amount' 
                    name='amount'
                    rules={[{ required: true, message: 'Please input the amount!' }]}>
                    <InputNumber min={1} placeholder='0'/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div> 
    );
};