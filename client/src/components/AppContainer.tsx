import React from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { HomePage } from './views/HomePage';
import { AddItem } from './views/AddItem';
import { RemoveItem } from './views/RemoveItem';
import { EditItem } from './views/EditItem';
import {
    UserOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    SmileOutlined,
    MailOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { AboutUs } from './views/AboutUs';
import { ContactUs } from './views/ContactUs';

const { Content, Footer, Header, Sider } = Layout;

export const AppContainer = () => {

    const navigate = useNavigate();

    const items = [
        {
            key: 'home',
            label: 'Home',
            icon: <UserOutlined/>,
            onClick: () => { navigate('/')}
        }, 
        {
            key: 'add',
            label: 'Add to Stack',
            icon: <PlusCircleOutlined/>,
            onClick: () => { navigate('/additem')}
        },
        {
            key: 'edit',
            label: 'Edit Item',
            icon: <EditOutlined/>,
            onClick: () => { navigate('/edititem')}
        },
        {
            key: 'remove',
            label: 'Remove Item',
            icon: <MinusCircleOutlined/>,
            onClick: () => { navigate('/removeitem')}
        },
        {
            key: 'about',
            label: 'About',
            icon: <SmileOutlined/>,
            onClick: () => { navigate('/about')}
        },
        {
            key: 'contact',
            label: 'Contact',
            icon: <MailOutlined/>,
            onClick: () => { navigate('/contact')}
        },
        
        
    ];

    return (
        <Layout hasSider>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu theme='dark' mode='inline' items={items} defaultSelectedKeys={['4']}/>
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
                <Header style={{ padding: 0, color: 'white', fontSize: '33px' }}> SILVER STACKER TRACKER</Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/additem' element={<AddItem />} />
                        <Route path='/edititem' element={<EditItem />} />
                        <Route path='/removeitem' element={<RemoveItem />} />
                        <Route path='/about' element={<AboutUs />} />
                        <Route path='/contact' element={<ContactUs />} />
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Silver Stacker Tracker App ©2024 Created by Michael Wilson
                </Footer>
            </Layout>
        </Layout>
    );
};
