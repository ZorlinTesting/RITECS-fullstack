import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { Button } from '@material-ui/core';
import { Container, Row, Col, Card, Alert, Button, ButtonGroup, ButtonToolbar, OverlayTrigger } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

import { Tooltip as BootstrapTooltip } from 'react-bootstrap';
import { Tooltip as RechartsTooltip } from 'recharts';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const AdminDashboard = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [metrics, setMetrics] = useState([]);
    const [taskStatus, setTaskStatus] = useState(null);

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };



    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('/metrics?no_page=true', {
                    withCredentials: true
                });
                setMetrics(response.data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('/csrf-token/', {
                    withCredentials: true  // Ensure credentials are included
                });
                console.log(response);
                // console.log('Fetched CSRF Token:', response.data.csrfToken);
                setCsrfToken(response.data.csrfToken);
                // Cookies.set('csrftoken', response.data.csrfToken);  // Set CSRF token in cookies
                console.log('Fetched CSRF Token:', response.data.csrfToken);
                Cookies.set('csrftoken', response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchMetrics();
        fetchCsrfToken();
    }, []);

    const handleStartTask = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            console.log('CSRF token from cookies:', csrfToken);
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            const response = await axios.post('/start-metrics-task/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,  // Ensure credentials are included
            });
            setTaskStatus({ message: response.data.status, type: 'success' });
        } catch (error) {
            console.error('Error starting task:', error);
            setTaskStatus({ message: 'Failed to start task', type: 'danger' });
        }
    };

    const handleStartScan = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            const response = await axios.post('/start-check-task/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            });
            setTaskStatus({ message: response.data.status, type: 'success' });
        } catch (error) {
            console.error('Error starting task:', error);
            setTaskStatus({ message: 'Failed to start task', type: 'danger' });
        }
    };

    const formatData = () => {
        return metrics
            .map(metric => ({
                timestamp: new Date(metric.timestamp).toLocaleString(),
                accuracy: metric.accuracy.toFixed(4),
                precision: metric.precision.toFixed(4),
                recall: metric.recall.toFixed(4),
                f1_score: metric.f1_score.toFixed(4),
            }))
            .reverse(); // Reverse the data to show the oldest first
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    <p className="label">{`Time: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>{`${entry.name}: ${entry.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };



    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h1>Admin Dashboard</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    {taskStatus && (
                        <Alert variant={taskStatus.type}>
                            {taskStatus.message}
                        </Alert>
                    )}
                    <Card>
                        <Card.Header>Metrics Overview

                        </Card.Header>
                        <Card.Body>
                            {metrics.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={formatData()}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="timestamp" tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} height={70} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="precision" name="Precision" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="recall" name="Recall" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="f1_score" name="F1 Score" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No metrics available</p>
                            )}
                            {/* {metrics.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={formatData()}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timestamp" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="user_agreement" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No metrics available</p>
                            )} */}
                        </Card.Body>
                        <Card.Footer>
                            <ButtonToolbar className="justify-content-end">
                                <ButtonGroup className="mr-2">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<BootstrapTooltip>Manual alternative; system runs these tasks routinely in the backend.</BootstrapTooltip>}
                                    >
                                        <Button variant="primary" onClick={handleStartTask}>
                                            Start Metrics Calculation
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<BootstrapTooltip>Manual alternative; system runs these tasks routinely in the backend.</BootstrapTooltip>}
                                    >
                                        <Button variant="secondary" onClick={handleStartScan}>
                                            Start Directory Scan
                                        </Button>
                                    </OverlayTrigger>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;