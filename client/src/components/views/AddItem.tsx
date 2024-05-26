import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
    AutoComplete,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Radio,
    Select,
    Tooltip,
    Typography,
    Upload
} from 'antd';
import { 
    convertToOz, 
    convertToOzt, 
    convertToGrams, 
    formatDate } from '../helpers';

const { Dragger } = Upload;
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
    imagefileid: number;
}

const handleAddDataFields = (formData: formData) => {
    let newFormData = formData;
    let purity = Number(newFormData.purity);
    let amount = newFormData.amount;
    // Convert the weight to all three types of weight with their pure weight
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

    const [pictureId, setPictureId] = useState(null);

    const uploadProps = {
        name: 'imagefile',
        multiple: false,
        action: 'http://localhost:4000/upload',
        onChange(info: any) {
            const { status } = info.file;
            console.log("INFO", info.file, info.fileList)
            if (status !== 'uploading') {
                console.log("info file response",info.file.response.imageId);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                // Update pictureId with the image id from the server response
                setPictureId(info.file.response.imageId);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish = async () => {
        const {purchasedate, ...formValues} = form.getFieldsValue();
        console.log("picture id before data build", pictureId)
        // purchasedate formatted into a string so it passes correct value to backend
        const formattedDate = purchasedate ? purchasedate.format('YYYY-MM-DD') : null;
        let fullData = handleAddDataFields(formValues);
        fullData = { ...fullData, purchasedate: formattedDate, imagefileid: pictureId ?? 0};
        console.log(fullData);
        try {
            await axios.post('http://localhost:4000/stack', fullData);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch existing purchase place values from the database for the AutoComplete component
    const [autoCompletePurchaseOptions, setautoCompletePurchaseOptions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/purchasedfrom')
          .then(response => response.json())
          .then(data => {
            // Map the data to the format required by AutoComplete
            const options = data.map((item: any) => ({ value: item.purchasedfrom }));
            console.log("options",options);
            setautoCompletePurchaseOptions(options);
          });
      }, []);

      // Fetch existing mint values from the database
      const [autoCompleteMintOptions, setautoCompleteMintOptions] = useState([]);

      useEffect(() => {
          fetch('http://localhost:4000/mints')
            .then(response => response.json())
            .then(data => {
              // Map the data to the format required by AutoComplete
              const options = data.map((item: any) => ({ value: item.mint }));
              console.log("options",options);
              setautoCompleteMintOptions(options);
            });
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
                    <AutoComplete
                        options={autoCompletePurchaseOptions}
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
                    />
                </Form.Item>

                <Form.Item 
                    label='Form' 
                    name='form' 
                    rules={[{ required: true, message: 'Please input the form of the metal!' }]}
                >
                    <Select placeholder='Select the form of the item'>
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
                    <AutoComplete
                        options={autoCompleteMintOptions}
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
                        {metals.map((metal)=>(
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

                //TODO: add default image in case of no image uploaded
                <Form.Item label='Upload Image' name='imagefile'>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag image to this area to upload</p>
                        <p className="ant-upload-hint">Add a picture of your item.</p>
                    </Dragger>
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
