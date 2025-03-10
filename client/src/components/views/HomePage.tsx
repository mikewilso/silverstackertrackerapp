import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Divider, Col, Row, Typography } from 'antd';
import StackPieChart from '../charts/StackPieChart';
import axios from 'axios';

const { Title } = Typography;

export const HomePage = () => {

    const metalPrices = {
        gold: 2500,
        silver: 30,
        copper: 0.25,
    };

    const [totalGoldWeights, setTotalGoldWeights] = useState(0);
    const [totalSilverWeights, setTotalSilverWeights] = useState(0);
    const [totalCopperWeights, setTotalCopperWeights] = useState(0);

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

    const totalWeightData = [
        { name: 'Gold', value: Number(totalGoldWeights) },
        { name: 'Silver', value: Number(totalSilverWeights) },
        { name: 'Copper', value: Number(totalCopperWeights) },
    ];

    const totalValueData = [
        { name: 'Gold', value: Number(totalGoldWeights) * metalPrices.gold },
        { name: 'Silver', value: Number(totalSilverWeights) * metalPrices.silver }, 
        { name: 'Copper', value: Number(totalCopperWeights) * metalPrices.copper },
    ];

    return (
        <div>
            <Title>Michael's Home Page</Title>
            <div>
                <Title level={3}>TOTAL GOLD: {totalGoldWeights} OZT</Title>
                <Title level={3}>TOTAL SILVER: {totalSilverWeights} OZT</Title>
                <Title level={3}>TOTAL COPPER: {totalCopperWeights} OZT</Title>
                <Title level={3}>TOTAL WEIGHT: {Number(totalGoldWeights) + Number(totalSilverWeights) + Number(totalCopperWeights)} OZT</Title>
                <Title level={3}>TOTAL GOLD VALUE: ${(totalGoldWeights * metalPrices.gold).toFixed(2)}</Title>
                <Title level={3}>TOTAL SILVER VALUE: ${(totalSilverWeights * metalPrices.silver).toFixed(2)}</Title>
                <Title level={3}>TOTAL COPPER VALUE: ${(totalCopperWeights * metalPrices.copper).toFixed(2)}</Title>
                <Title level={3}>TOTAL VALUE: ${((totalGoldWeights * metalPrices.gold) + (totalSilverWeights * metalPrices.silver) + (totalCopperWeights * metalPrices.copper)).toFixed(2)}</Title>
            </div>
            <Divider />
            <Row>
                <Col span={12}>
                    <StackPieChart data={totalWeightData} />
                </Col>
                <Col span={12}>
                    <StackPieChart data={totalValueData} />
                </Col>
            </Row>
            <Divider />
        </div>
    );
};