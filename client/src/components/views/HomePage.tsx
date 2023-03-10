import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface Data {
    message: string;
}

export const HomePage = () => {
    const [data, setData] = useState<Data>({ message: '' });

    useEffect(() => {
        fetch('http://localhost:5000/home')
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div>
            <Title>{data.message}'s Home Page</Title>
        </div>
    );
};
