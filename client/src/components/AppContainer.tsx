import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
                <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
                    <Menu.Item
                        key='home'
                        icon={React.createElement(UserOutlined)}
                    >
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='add'
                        icon={React.createElement(PlusCircleOutlined)}
                    >
                        <Link to='/additem'>Add to Stack</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='edit'
                        icon={React.createElement(EditOutlined)}
                    >
                        <Link to='/edititem'>Edit Item</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='remove'
                        icon={React.createElement(MinusCircleOutlined)}
                    >
                        <Link to='/removeitem'>Remove Item</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='about'
                        icon={React.createElement(SmileOutlined)}
                    >
                        <Link to='/about'>About</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='contact'
                        icon={React.createElement(MailOutlined)}
                    >
                        <Link to='/contact'>Contact</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
                <Header style={{ padding: 0 }}> SILVER STACKER TRACKER</Header>
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
