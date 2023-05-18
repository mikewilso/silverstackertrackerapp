import React, { FC, useEffect, useState } from 'react';
import type { FormInstance } from 'antd/es/form';
import { useForm } from 'antd/lib/form/Form';
import axios from 'axios';
import moment from 'moment';
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Typography,
} from 'antd';

const { Title } = Typography;

interface formData {
    name: string;
    description: string;
    purchasedate: string;
    metaltype: string;
    unittype: string;
    weight: number;
    amount: number;
}

const convertToGrams = (num: number, unitType?: string) => {
    if (unitType === 'oz') {
        return num * 28.35;
    } else if (unitType === 'ozt') {
        return num * 31.103;
    } else return num;
};

const handleCleaningData = (formData: formData) => {
    let newFormData = formData;
    newFormData.purchasedate = moment(formData.purchasedate).format(
        'YYYY-MM-DD',
    );
    newFormData.weight = convertToGrams(formData.weight, formData.unittype);
    return newFormData;
};

export const AddItem = () => {
    const [form] = Form.useForm();

    const onFinish = async () => {
        const formValues = form.getFieldsValue();
        const cleanedData = handleCleaningData(formValues);
        console.log(formValues);
        try {
            await axios.post('http://localhost:4000/stack', cleanedData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Title>Add to the Stack</Title>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout='horizontal'
                disabled={false}
                style={{ maxWidth: 800 }}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item label='Name of Item' name='name'>
                    <Input />
                </Form.Item>
                <Form.Item label='Purchase Date' name='purchasedate'>
                    <DatePicker />
                </Form.Item>
                <Form.Item label='Description' name='description'>
                    <Input />
                </Form.Item>
                <Form.Item label='Metal' name='metaltype'>
                    <Select>
                        <Select.Option value='gold'>Gold</Select.Option>
                        <Select.Option value='silver'>Silver</Select.Option>
                        <Select.Option value='copper'>Copper</Select.Option>
                        <Select.Option value='platinum'>Platinum</Select.Option>
                        <Select.Option value='palladium'>
                            Palladium
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Weight' name='weight'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='Unit Type' name='unittype'>
                    <Radio.Group defaultValue={'ozt'}>
                        <Radio value='ozt'> Troy Ounces </Radio>
                        <Radio value='oz'> Ounces </Radio>
                        <Radio value='grams'> Grams </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Amount' name='amount'>
                    <InputNumber />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center', marginLeft: '100px' }}>
                    <Button htmlType='submit' style={{ width: '100%' }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
