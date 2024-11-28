import React, { useEffect, useState } from 'react';
import { 
    Button,
    Card,
    Col, 
    Row, 
    Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

export const HomePage = () => {

    const [totalGoldWeights, setTotalGoldWeights] = useState(0);
    const [totalSilverWeights, setTotalSilverWeights] = useState(0);
    const [totalCopperWeights, setTotalCopperWeights] = useState(0);
    const [showInterstitial, setShowInterstitial] = useState(true);

    const handleContinue = () => {
        setShowInterstitial(false);
    };

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/silver');
                setTotalSilverWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/gold');
                setTotalGoldWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);

    useEffect(() => {
        const fetchTotaloztweight = async () => {
            try {
                const res = await axios.get('http://localhost:4000/stack/totals/copper');
                setTotalCopperWeights(res.data[0].totalozt);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotaloztweight();
    }, []);



    return (
        <div>
            {showInterstitial && (
                <div style={overlayStyle}>
                    <Card
                        title="Welcome to Michael's Home Page"
                        bordered={false}
                        style={cardStyle}
                        actions={[
                            <Button type="primary" onClick={handleContinue}>Continue</Button>
                        ]}
                    >
                        <p>This is an interstitial card. You can put any content here.</p>
                    </Card>
                </div>
            )}
            <Title>Michael's Home Page</Title>
            <div>
                <Title level={3}>TOTAL GOLD: {totalGoldWeights} OZT</Title>
                <Title level={3}>TOTAL SILVER: {totalSilverWeights} OZT</Title>
                <Title level={3}>TOTAL COPPER: {totalCopperWeights} OZT</Title>
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
    width: 300,
    textAlign: 'center',
};