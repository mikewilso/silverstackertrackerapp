import React, { useState } from 'react';
import axios from 'axios';
import ImgCrop from "antd-img-crop";
import { 
    CloseOutlined, 
    InboxOutlined, 
    InfoCircleOutlined, 
    PlusOutlined } from '@ant-design/icons';
import {
    AutoComplete,
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Radio,
    Select,
    Space,
    Tooltip,
    Typography,
    Upload
} from 'antd';
import { useFetchMetals } from '../getters/useFetchMetals';
import { useFetchItemForms } from '../getters/useFetchItemForms';
import { useFetchPurchasePlaces } from '../getters/useFetchPurchasePlaces';
import { useFetchMints } from '../getters/useFetchMints';
import { useFetchPurities } from '../getters/useFetchPurities';
import { handleAddDataFields } from '../helpers/useDataConversions';

const { Dragger } = Upload;
const { Title } = Typography;


export const AddItem = () => {
    const [form] = Form.useForm();
    const [pictureId, setPictureId] = useState(null);
    const [formRefreshKey, setFormRefreshKey] = useState(0);
    const [newFormValue, setNewFormValue] = useState('');
    const [newMetalValue, setNewMetalValue] = useState('');
    const [metalRefreshKey, setMetalRefreshKey] = useState(0);

    const itemForms = useFetchItemForms(formRefreshKey);
    const metals = useFetchMetals(metalRefreshKey);

    const handleAddForm = async () => { 
        console.log("new form value", newFormValue);
        if(newFormValue === undefined || newFormValue === '') {
            return;
        }
        const itemFormValue = newFormValue.toLowerCase();
        const itemFormType = newFormValue.charAt(0).toUpperCase() + newFormValue.slice(1).toLowerCase();

        if(itemForms.some((itemform) => itemform.itemformvalue === itemFormValue)) {
            message.error('This item form already exists');
            return;
        }
        try {
            await axios.post('http://localhost:4000/itemforms/add', { itemformvalue: itemFormValue, itemformtype: itemFormType});
            console.log("Form added successfully");
            setFormRefreshKey(prevKey => prevKey + 1);
            setNewFormValue('');
        }
        catch (err) {
            console.log(err);
        }
    }
        

    const handleRemoveForm = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/itemforms/remove/${id}`);
            console.log("Form removed successfully");
            setFormRefreshKey(prevKey => prevKey + 1);
        }
        catch (err) {
            console.log(err);
        }
    };

    const onFormNameChange = (e: any) => {
        setNewFormValue(e.target.value);
        console.log(e.target.value);
    }

    const handleAddMetal = async () => {
        console.log("new metal value", newMetalValue);
        if(newMetalValue === undefined || newMetalValue === '') {
            return;
        }
        const metalValue = newMetalValue.toLowerCase();
        const metalType = newMetalValue.charAt(0).toUpperCase() + newMetalValue.slice(1).toLowerCase();

        if(metals.some((metal) => metal.metalvalue === metalValue)) {
            message.error('This metal type already exists');
            return;
        }
        try {
            await axios.post('http://localhost:4000/metals/add', { metalvalue: metalValue, metaltype: metalType});
            console.log("Metal added successfully");
            setMetalRefreshKey(prevKey => prevKey + 1);
            setNewMetalValue('');
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleRemoveMetal = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/metals/remove/${id}`);
            console.log("Metal removed successfully");
            setMetalRefreshKey(prevKey => prevKey + 1);
        }
        catch (err) {
            console.log(err);
        }
    };

    const onMetalNameChange = (e: any) => {
        setNewMetalValue(e.target.value);
        console.log(e.target.value);
    }

    const inputRef = React.useRef(null);

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
        action: 'http://localhost:4000/image/upload',
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
    const onFinishForm = async () => {
        console.log('Received values of form: ', form.getFieldsValue());
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
                onFinish={onFinishForm}
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
                        <Select 
                            placeholder='Select the form of the item' 
                            optionLabelProp='itemformtype'
                            dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider
                                    style={{
                                      margin: '8px 0',
                                    }}
                                  />
                                  <Space
                                    style={{
                                      padding: '0 8px 4px',
                                    }}
                                  >
                                    <Input
                                      placeholder="Please enter item form"
                                      ref={inputRef}
                                      value={newFormValue}
                                      onChange={onFormNameChange}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={handleAddForm}>
                                      Add new item form
                                    </Button>
                                  </Space>
                                </>
                              )}
                        >

                            {itemForms.map((itemform) => (
                                <Select.Option key={itemform.id} value={itemform.itemformtype}>
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
                    <Select 
                        placeholder='Select metal type'
                        optionLabelProp='label'
                        dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider
                                style={{
                                  margin: '8px 0',
                                }}
                              />
                              <Space
                                style={{
                                  padding: '0 8px 4px',
                                }}
                              >
                                <Input
                                  placeholder="Please enter item form"
                                  ref={inputRef}
                                  value={newMetalValue}
                                  onChange={onMetalNameChange}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                                <Button type="text" icon={<PlusOutlined />} onClick={handleAddMetal}>
                                  Add new metal type
                                </Button>
                              </Space>
                            </>
                            )}
                    >
                        {metals.map((metal) => (
                                <Select.Option key={metal.id} value={metal.metaltype}>
                                    <span>{metal.metaltype}</span>
                                    <span style={{ float: "right" }}>
                                    <CloseOutlined
                                        style={{ color: 'lightgrey' }}
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMetal(metal.id);
                                        }}
                                    />
                                    </span>
                                </Select.Option>
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
                    rules={[{ required: true, message: 'Please input the purity of the item!' }]}>                   
                        <Select placeholder='Select purity of item'>
                            {useFetchPurities().map((purity)=>(
                                <Select.Option value={purity.purity}>{purity.name}</Select.Option>
                            ))};
                        </Select>
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
