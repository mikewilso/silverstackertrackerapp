import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImgCrop from "antd-img-crop";
import { CloseOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
    AutoComplete,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Popover,
    Radio,
    Select,
    Space,
    Tooltip,
    Typography,
    Upload
} from 'antd';
import { 
    convertToOz, 
    convertToOzt, 
    convertToGrams, 
    formatDate } from '../helpers/useDataConversions';
import { useFetchMetals } from '../getters/useFetchMetals';
import { useFetchItemForms } from '../getters/useFetchItemForms';
import { useFetchPurchasePlaces } from '../getters/useFetchPurchasePlaces';
import { useFetchMints } from '../getters/useFetchMints';
import { useFetchPurities } from '../getters/useFetchPurities';
import { formData } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;


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
    const [pictureId, setPictureId] = useState(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [formRefreshKey, setFormRefreshKey] = useState(0);

    const itemForms = useFetchItemForms(formRefreshKey);
    
    const handleAddForm = async (values: any) => {
        console.log("Adding new form", values.newForm);
        if(values.newForm === undefined || values.newForm === '') {
            setPopoverVisible(false);
            return;
        }
        const itemFormValue = values.newForm.toLowerCase();
        const itemFormType = values.newForm.charAt(0).toUpperCase() + values.newForm.slice(1).toLowerCase();

        if(itemForms.some((itemform) => itemform.itemformvalue === itemFormValue)) {
            message.error('This item form already exists');
            return;
        }
        try {
            await axios.post('http://localhost:4000/addform', { itemformvalue: itemFormValue, itemformtype: itemFormType});
            console.log("Form added successfully");
            // Close the popover
            setPopoverVisible(false);
            setFormRefreshKey(prevKey => prevKey + 1);
            form.resetFields();
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleRemoveForm = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/removeform/${id}`);
            console.log("Form removed successfully");
            setFormRefreshKey(prevKey => prevKey + 1);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleAddMetal = (values: any) => {
        console.log("Adding new metal", values.newMetal);
    };

    const handleAddPurity = (values: any) => {
        console.log("Adding new purity", values.newPurity);
    };

    const getSrcFromFile = (file: any) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      };
    
    const onPreview = async (file: any) => {
        const src = file.url || (await getSrcFromFile(file));
        const imgWindow = window.open(src);
    
        if (imgWindow) {
          const image = new Image();
          image.src = src;
          imgWindow.document.write(image.outerHTML);
        } else {
          window.location.href = src;
        }
      };

    const uploadProps = {
        name: 'imagefile',
        multiple: false,
        action: 'http://localhost:4000/upload',
        onChange(info: any) {
            const { status } = info.file;
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
    // TODO: Add a function to reset form fields after submission
    const onFinish = async () => {
        const {purchasedate, ...formValues} = form.getFieldsValue();
        // purchasedate formatted into a string so it passes correct value to backend
        const formattedDate = purchasedate ? purchasedate.format('YYYY-MM-DD') : null;
        let fullData = handleAddDataFields(formValues);
        fullData = { ...fullData, purchasedate: formattedDate, imagefileid: pictureId ?? 0};
        try {
            await axios.post('http://localhost:4000/stack', fullData);
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
                {/* TODO: Add AutoComplete to name field, if item already exists, give option to update existing record */}
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
                    <Input.TextArea placeholder="Enter item description (optional)" />
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
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Select placeholder='Select the form of the item' optionLabelProp="label">
                            {itemForms.map((itemform) => (
                                <Select.Option key={itemform.id} value={itemform.itemformvalue}>
                                    <span>{itemform.itemformtype}</span>
                                    <span style={{ float: "right" }}>
                                    <CloseOutlined
                                        style={{ color: 'lightgrey' }}
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveForm(itemform.id);
                                        }}
                                    />
                                    </span>
                                </Select.Option>
                            ))}
                        </Select>
                        <Popover
                            content={
                                <Form onFinish={handleAddForm}>
                                    <Form.Item name='newForm' rules={[{ required: false }]} style={{ width: '100px' }}  >
                                        <Input placeholder='Enter new form'/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>Add</Button>
                                        <Button type='default' onClick={() => setPopoverVisible(false)}>Close</Button>
                                    </Form.Item>
                                </Form>
                            }
                            title='Add New Form'
                            trigger='click'
                            open={popoverVisible}
                            onOpenChange={(visible) => setPopoverVisible(visible)}
                        >
                            <Button 
                                type='default' 
                                size='small' 
                                style={{ marginLeft: '10px' }}
                                onClick={() => {
                                    if(popoverVisible) {
                                        setPopoverVisible(false);
                                    } else {
                                        setPopoverVisible(true);
                                    }}
                                }
                                >
                                Add Form
                            </Button>
                        </Popover>                    
                    </div>
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
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Select placeholder='Enter metal type'>
                            {useFetchMetals().map((metal)=>(
                                <Select.Option value={metal.metalvalue}>{metal.metaltype}</Select.Option>
                            ))}
                        </Select>
                        <Popover
                            content={
                                <Form onFinish={handleAddMetal}>
                                    <Form.Item name='newMetal' rules={[{ required: true, message: 'Please input the new metal type!' }]}>
                                        <Input placeholder='Enter new metal type' />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>Add</Button>
                                    </Form.Item>
                                </Form>
                            }
                            title='Add New Metal'
                            trigger='click'
                        >
                            <Button type='default' size='small' style={{ marginLeft: '10px' }}>Add Metal</Button>
                        </Popover>
                    </div>
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
                    <Space>                 
                    <Select placeholder='Select purity of item'>
                        {useFetchPurities().map((purity)=>(
                            <Select.Option value={purity.purity}>{purity.name}</Select.Option>
                        ))};
                    </Select>
                    <Popover
                        content={
                            <Form onFinish={handleAddPurity}>
                                <Form.Item name='newPurity' rules={[{ required: true, message: 'Please input the new purity level!' }]}>
                                    <Input placeholder='Enter new purity level' />
                                </Form.Item>
                                <Form.Item>
                                    <Button type='primary' htmlType='submit'>Add</Button>
                                </Form.Item>
                            </Form>
                        }
                        title='Add New Purity'
                        trigger='click'
                    >
                        <Button type='default' size='small' style={{ marginLeft: '10px' }}>Add Purity</Button>
                    </Popover>
                    </Space> 
                </Form.Item>

                <Form.Item 
                    label='Amount' 
                    name='amount'
                    rules={[{ required: true, message: 'Please input the amount!' }]}>
                    <InputNumber min={1} placeholder='0'/>
                </Form.Item>

                <Form.Item label='Upload Image' name='imagefile'>
                    <ImgCrop showGrid rotationSlider showReset>
                        <Dragger 
                            onPreview={onPreview} 
                            {...uploadProps}
                            accept=".jpg,.jpeg,.png"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag image to this area to upload</p>
                            <p className="ant-upload-hint">Add a picture of your item.</p>
                        </Dragger>
                    </ImgCrop>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginLeft: '100px' }}>
                    <Button htmlType='submit' type='primary' style={{ width: '100%' }}>
                        Add to the Stack!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
