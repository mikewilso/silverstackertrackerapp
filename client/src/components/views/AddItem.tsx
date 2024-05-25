import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
import { 
    convertToOz, 
    convertToOzt, 
    convertToGrams, 
    formatDate } from '../helpers';

const { Title } = Typography;

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
}

const handleAddDataFields = (formData: formData) => {
    let newFormData = formData;
    let purity = Number(newFormData.purity);
    let amount = newFormData.amount;
    newFormData.purchasedate = formatDate(newFormData.purchasedate);
    newFormData.oztweight = convertToOzt(formData.unitweight, formData.weighttype);
    newFormData.ozweight = convertToOz(formData.unitweight, formData.weighttype);
    newFormData.gramweight = convertToGrams(formData.unitweight, formData.weighttype);
    newFormData.ozweightpure = newFormData.ozweight * purity;
    newFormData.oztweightpure = newFormData.oztweight * purity;
    newFormData.gramweightpure = newFormData.gramweight * purity;
    newFormData.totalpureozweight = newFormData.ozweightpure * amount;
    newFormData.totalpureoztweight = newFormData.oztweightpure * amount;
    newFormData.totalpuregramweight = newFormData.gramweightpure * amount;

    return newFormData;
};

export const AddItem = () => {
    const [form] = Form.useForm();

    const onFinish = async () => {
        const {purchasedate, ...formValues} = form.getFieldsValue();
        // purchasedate formatted into a string so it passes correct value to backend
        const formattedDate = purchasedate ? purchasedate.format('YYYY-MM-DD') : null;
        let fullData = handleAddDataFields(formValues);
        fullData = { ...fullData, purchasedate: formattedDate };
        console.log(fullData);
        try {
            await axios.post('http://localhost:4000/stack', fullData);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch metals from the database
    const [metals, setMetals] = useState([
        {
            id: 0,
            metalvalue: '',
            metaltype: ''
        }
    ]);

    useEffect(() => {
        const fetchMetals = async () => {
            try {
                const res = await axios.get('http://localhost:4000/metals');
                console.log(res.data);
                setMetals(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMetals();
    }, []);

    // Fetch item forms from the database
    const [itemForms, setItemForms] = useState([
        {
            id: 0,
            itemformvalue: '',
            itemformtype: ''
        }
    ]);

    useEffect(() => {
        const fetchItemForms = async () => {
            try {
                const res = await axios.get('http://localhost:4000/itemforms');
                console.log(res.data);
                setItemForms(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchItemForms();
    }, []);



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
                <Form.Item 
                    label='Name of Item' 
                    name='name'
                    rules={[{ required: true, message: 'Please input the name of the item!' }]}
                >
                    <Input placeholder='Enter item name'/>
                </Form.Item>
                <Form.Item 
                    label='Description' 
                    name='description'
                    rules={[{ required: false, message: 'Please input the description!' }]}
                >
                    <Input placeholder="Enter item description (optional)" />
                </Form.Item>
                <Form.Item 
                    label='Purchase Date' 
                    name='purchasedate'
                    rules={[{ required: true, message: 'Please select the purchase date!' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item 
                    label='Purchased From' 
                    name='purchasedfrom'
                    rules={[{ required: true, message: 'Please input where it was purchased from!' }]}
                >
                    <Input placeholder='Enter place of purchase(coin shop, APMEX, etc.)'/>
                </Form.Item>
                <Form.Item 
                    label='Purchase Price' 
                    name='purchaseprice'
                    rules={[{ required: true, message: 'Please input the purchase price!' }]}
                >
                    <InputNumber min={0} formatter={value => `$ ${value}`} style={{ width: '25%' }}/>
                </Form.Item>
                <Form.Item 
                    label='Form' 
                    name='form' 
                    rules={[{ required: true, message: 'Please input the form of the metal!' }]}
                >
                    <Select placeholder='Enter form of the item'>
                        {itemForms.map((itemform)=>(
                            <Select.Option value={itemform.itemformvalue}>{itemform.itemformtype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item 
                    label='Mint' 
                    name='mint'
                    rules={[{ required: true, message: 'Please input the maker of this item!' }]}
                >
                    <Input placeholder='Enter maker of the item'/>
                </Form.Item>
                <Form.Item 
                    label='Metal Type' 
                    name='metaltype'
                    rules={[{ required: true, message: 'Please choose the precious metal type!' }]}
                >
                    <Select placeholder='Enter metal type'>
                        {metals.map((metal)=>(
                            <Select.Option value={metal.metalvalue}>{metal.metaltype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item 
                    label='Weight' 
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
                    <Select>
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
                <Form.Item style={{ textAlign: 'center', marginLeft: '100px' }}>
                    <Button htmlType='submit' style={{ width: '100%' }}>
                        Add to the Stack!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
