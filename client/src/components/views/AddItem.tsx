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
    shape: string;
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
    let purity = newFormData.purity;
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
        const formValues = form.getFieldsValue();
        console.log("formvalues", formValues);
        const fullData = handleAddDataFields(formValues);
        console.log(formValues);
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
                <Form.Item label='Name of Item' name='name'>
                    <Input />
                </Form.Item>
                <Form.Item label='Description' name='description'>
                    <Input />
                </Form.Item>
                <Form.Item label='Purchase Date' name='purchasedate'>
                    <DatePicker />
                </Form.Item>
                <Form.Item label='Purchased From' name='purchasedfrom'>
                    <Input />
                </Form.Item>
                <Form.Item label='Purchase Price' name='purchaseprice'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='Shape' name='shape'>
                    <Input />
                </Form.Item>
                <Form.Item label='Mint' name='mint'>
                    <Input />
                </Form.Item>
                <Form.Item label='Metal Type' name='metaltype'>
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
                <Form.Item label='Weight' name='unitweight'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='Unit of Weight' name='weighttype'>
                    <Radio.Group>
                        <Radio value='ozt'>Troy Ounces</Radio>
                        <Radio value='oz'>Ounces</Radio>
                        <Radio value='grams'>Grams</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Purity' name='purity'>
                    <InputNumber />
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
