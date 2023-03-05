import React, { FC } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const name = 'Michael';

export const HomePage: FC = () => {
    return (
        <div>
            <Title>{name}'s HOME PAGE</Title>
        </div>
    );
};
