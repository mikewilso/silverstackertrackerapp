import React, { useEffect, useState } from 'react';
import { 
    AutoComplete,
    Button,  
    Form, 
    Input,
    InputNumber,
    Radio,
    Select,
    Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formData } from './interfaces';

type EditFormProps = {
    currentRecord: formData;
}

// TODO: Add AutoComplete options for fields, put in a separate file?
// TODO: Add Select options for fields, put in a separate file?
// TODO: Add the rest of the form fields
// TODO: Add ability to change the image file
export const EditForm = ({ currentRecord }: EditFormProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        // TODO: Add API call to update the record
    };

    // Update form fields whenever currentRecord changes
    useEffect(() => {
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
                <Input.TextArea />
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
                        {/* {itemForms.map((itemform)=>(
                            <Select.Option value={itemform.itemformvalue}>{itemform.itemformtype}</Select.Option>
                        ))} */}
                    </Select>
                </Form.Item>

                <Form.Item 
                    label='Mint' 
                    name='mint'
                    rules={[{ required: true, message: 'Please input the maker of this item!' }]}
                >
                    <AutoComplete
                        // options={autoCompleteMintOptions}
                        // placeholder='Enter maker of the item'
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
                        {/* {metals.map((metal)=>(
                            <Select.Option value={metal.metalvalue}>{metal.metaltype}</Select.Option>
                        ))} */}
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