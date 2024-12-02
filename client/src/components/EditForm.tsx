import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
        AutoComplete,
        Button,
        Divider, 
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
import { formData } from '../types/types';
import { useFetchMetals } from './hooks/useFetchMetals'
import { useFetchItemForms } from './hooks/useFetchItemForms'
import { useFetchPurchasePlaces } from './hooks/useFetchPurchasePlaces'
import { useFetchMints } from './hooks/useFetchMints'
import { handleAddDataFields } from './helpers/useDataConversions';
import ImgCrop from "antd-img-crop";

type EditFormProps = {
    currentRecord: formData;
    onEditSuccess: () => void;
}

// Add Image type to window
//eslint-disable-next-line
interface Window {
    Image: {   
        prototype: HTMLImageElement;
        new (): HTMLImageElement;
    };
}

// TODO: Add ability to change the image file
export const EditForm = ({ currentRecord, onEditSuccess }: EditFormProps) => {
    const [form] = Form.useForm();
    const [pictureId, setPictureId] = useState(0);
    const [recordId, setRecordId] = useState({id: 0});
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setRecordId({ id: currentRecord.id });
        setPictureId(currentRecord.imagefileid);
        setImageUrl(`http://localhost:4000/image/${currentRecord.imagefileid}`);
    }, [currentRecord]);

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
          const image = new window.Image()
          image.src = src;
          imgWindow.document.write(image.outerHTML);
        } else {
          window.location.href = src;
        }
      };

    const onFinish = async (values: any) => {
        try {
            let updatedValues = handleAddDataFields(values);
            // Get the current record from the database
            const currentRecordResponse = await axios.get(`http://localhost:4000/stack/${currentRecord.id}`);
            const oldPictureId = currentRecordResponse.data[0].imagefileid;

            // Delete the old image record from the database
            if(oldPictureId !== pictureId){
                await axios.delete(`http://localhost:4000/image/remove/${oldPictureId}`);
            }
            // Update the imagefileid with the new pictureId or keep the current imagefileid
            updatedValues.imagefileid = pictureId || currentRecord.imagefileid;
            console.log('Updated values:', updatedValues);
            const response = await axios.put(`http://localhost:4000/stack/${recordId.id}`, updatedValues);
            console.log('Updated record:', response.data);
            onEditSuccess();
            message.success('Record updated successfully!');
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image 
                    src={imageUrl}
                    width={250} 
                    height={250}
                />
                <br />
                <ImgCrop showGrid rotationSlider showReset>
                    <Upload 
                        name= 'imagefile'
                        onPreview={onPreview}
                        showUploadList={false}
                        action = 'http://localhost:4000/image/upload'
                        multiple = {false}
                        accept=".jpg,.jpeg,.png"
                        onChange = {(info: any) => {
                            const { status } = info.file;
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
                </ImgCrop>
            </div>

            <Divider />

            <Form 
                form={form} 
                onFinish={onFinish}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
            >
                <Form.Item
                    name="imagefileid"
                    hidden
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: 'bold' }}>Name</span>}
                    name="name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: 'bold' }}>Description</span>}
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <Input.TextArea placeholder="Enter item description (optional)" />
                </Form.Item>

                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Purchase Date</span>}
                    name='purchasedate'
                    rules={[{ required: true, message: 'Please select the purchase date!' },
                    { pattern: /^\d{4}-\d{2}-\d{2}$/, message: 'Please enter a date in the format YYYY-MM-DD!' }]}        
                    >
                    <Input  placeholder='YYYY-MM-DD'/>
                </Form.Item>

                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Purchased From</span>} 
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
                            {<span style={{ fontWeight: 'bold' }}>Unit Price </span>} 
                                        <Tooltip title="Price per unit at time of purchase.">
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
                    label={<span style={{ fontWeight: 'bold' }}>Form</span>} 
                    name='formtype' 
                    rules={[{ required: true, message: 'Please input the form of the metal!' }]}
                >
                    <Select placeholder='Select the form of the item'>
                        {useFetchItemForms(0).map((itemform)=>(
                            <Select.Option value={itemform.itemformvalue}>{itemform.itemformtype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Mint</span>} 
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
                    label={<span style={{ fontWeight: 'bold' }}>Metal Type</span>} 
                    name='metaltype'
                    rules={[{ required: true, message: 'Please choose the precious metal type!' }]}
                >
                    <Select placeholder='Enter metal type'>
                        {useFetchMetals(0).map((metal)=>(
                            <Select.Option value={metal.metalvalue}>{metal.metaltype}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Unit Weight</span>} 
                    name='unitweight'
                    rules={[{ required: true, message: 'Please input the weight!' }]}>
                    <InputNumber min={0.001} placeholder='0.001'/>
                </Form.Item>
           
                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Unit of Weight</span>}
                    name='weighttype'
                    rules={[{ required: true, message: 'Please choose the unit of weight!' }]}>
                    <Radio.Group>
                        <Radio value='ozt'>Troy Ounces</Radio>
                        <Radio value='oz'>Ounces</Radio>
                        <Radio value='grams'>Grams</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item 
                    label={<span style={{ fontWeight: 'bold' }}>Purity</span>}
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
                    label={<span style={{ fontWeight: 'bold' }}>Amount</span>}
                    name='amount'
                    rules={[{ required: true, message: 'Please input the amount!' }]}>
                    <InputNumber min={1} placeholder='0'/>
                </Form.Item>

                <Divider />

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" style={{ width: '200px' }}>
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div> 
    );
};