import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    AutoComplete,
    Button,  
    DatePicker,
    Form, 
    Input,
    InputNumber,
    Radio,
    Select,
    Space,
    Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
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
// TODO: Data validation on date field
export const EditForm = ({ currentRecord }: EditFormProps) => {
    const [form] = Form.useForm();

    const [recordId, setRecordId] = useState({id: 0});

    useEffect(() => {
        setRecordId({ id: currentRecord.id });
    }, [currentRecord]);

    const onFinish = async (values: any) => {
        try {
            await handleAddDataFields(values).then(async (updatedValues) => {
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
        <Form form={form} onFinish={onFinish}>
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
                    <Input />
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
    );
};