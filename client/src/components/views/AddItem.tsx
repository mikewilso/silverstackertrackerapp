// import React, { FC, useEffect, useState } from 'react';
// import axios from 'axios';
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

const submitForm = () => {
    console.log('submit form');
};

export const AddItem = () => {
    // const [stack, setStack] = useState([]);

    // useEffect(() => {
    //     const fetchStack = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:4000/stack');
    //             console.log(res);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     fetchStack();
    // }, []);

    return (
        <div>
            <Title>Add to the Stack</Title>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout='horizontal'
                disabled={false}
                style={{ maxWidth: 800 }}
            >
                <Form.Item label='Name of Item'>
                    <Input />
                </Form.Item>
                <Form.Item label='Purchase Date'>
                    <DatePicker />
                </Form.Item>
                <Form.Item label='Description'>
                    <Input />
                </Form.Item>
                <Form.Item label='Metal'>
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
                <Form.Item label='Weight'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='Unit Type'>
                    <Radio.Group>
                        <Radio value='troyounces'> Troy Ounces </Radio>
                        <Radio value='avdpounces'> AVDP Ounces </Radio>
                        <Radio value='grams'> Grams </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Amount'>
                    <InputNumber />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center', marginLeft: '100px' }}>
                    <Button
                        onClick={() => submitForm()}
                        style={{ width: '100%' }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
