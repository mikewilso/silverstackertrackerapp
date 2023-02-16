import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomePage } from './HomePage';
import { AddItem } from './AddItem';
import { RemoveItem } from './RemoveItem';
import { EditItem } from './EditItem';
import {
    UserOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    SmileOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { AboutUs } from './AboutUs';
import { ContactUs } from './ContactUs';

const { Content, Footer, Header, Sider } = Layout;

export const AppContainer = () => {
    // const sidebarSectionNames = [
    //     'Home',
    //     'Add',
    //     'Remove',
    //     'About Us',
    //     'Contact',
    // ];
    // const items: MenuProps['items'] = [
    //     UserOutlined,
    //     PlusCircleOutlined,
    //     MinusCircleOutlined,
    //     SmileOutlined,
    //     MailOutlined,
    // ].map((icon, index) => ({
    //     key: String(index + 1),
    //     icon: React.createElement(icon),
    //     label: `${sidebarSectionNames[index]}`,
    // }));

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
                        key='remove'
                        icon={React.createElement(MinusCircleOutlined)}
                    >
                        <Link to='/removeitem'>Remove</Link>
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
            <Layout className='site-layout' style={{ marginLeft: 200 }}>
                <Header style={{ padding: 0 }} />
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/additem' element={<AddItem />} />
                        <Route path='/removeitem' element={<RemoveItem />} />
                        <Route path='/about' element={<AboutUs />} />
                        <Route path='/contact' element={<ContactUs />} />
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Silver Stacker Tracker Apper ©2023 Created by Michael Wilson
                </Footer>
            </Layout>
        </Layout>
    );
};
