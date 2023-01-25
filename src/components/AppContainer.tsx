import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
    UserOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    SmileOutlined,
    MailOutlined,
} from '@ant-design/icons';

const { Content, Footer, Header, Sider } = Layout;

export const AppContainer: FC = () => {
    const sidebarSectionNames = [
        'Home',
        'Add',
        'Remove',
        'About Us',
        'Contact',
    ];
    const items: MenuProps['items'] = [
        UserOutlined,
        PlusCircleOutlined,
        MinusCircleOutlined,
        SmileOutlined,
        MailOutlined,
    ].map((icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: `${sidebarSectionNames[index]}`,
    }));

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
                <Menu
                    theme='dark'
                    mode='inline'
                    defaultSelectedKeys={['4']}
                    items={items}
                />
            </Sider>
            <Layout className='site-layout' style={{ marginLeft: 200 }}>
                <Header style={{ padding: 0 }} />
                <Content
                    style={{ margin: '24px 16px 0', overflow: 'initial' }}
                ></Content>
                <Footer style={{ textAlign: 'center' }}>
                    Silver Stacker Tracker Apper ©2023 Created by Michael Wilson
                </Footer>
            </Layout>
        </Layout>
    );
};
