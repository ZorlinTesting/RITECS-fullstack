import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

import home_screen_image from "../assets/home_screen_image.png";
import setup_screen_image from "../assets/setup_screen_image.png";
import selection_screen_image from "../assets/selection_screen_image.png";
import admin_dashboard_image from "../assets/admin_dashboard_image.png";


const AboutScreen = () => {
    return (
        <Container>
            <Row className="my-5">
                <Col>
                    <Card>
                        <Card.Header as="h3" style={{ backgroundColor: "white"}}> Image Checking System Overview</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Welcome to the Image Checking System! This system helps in reviewing and verifying images detected by the automated detection system. You will be able to select image segments and provide your feedback or corrections. This guide will help you understand how to use the system effectively.
                            </Card.Text>
                            <Card.Title as="h4">Getting Started</Card.Title>
                            <Card.Text>
                                <ol>
                                    <li>
                                        <b>Login:</b>
                                        <ul>
                                            <li>Open your browser and navigate to the web page. You will be greeted by the home screen. Click on the “Get Started” button.</li>
                                            <li>Enter your username and password.</li>
                                            <li>Click on the "Login" button to access the system.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Card.Text>
                            <Card.Img style= {{width: "648px", height: "299px", display: "block", margin: "0 auto" }} variant="top" src={home_screen_image} alt="Home screen" />
                            <br></br>
                            <Card.Title as="h4">Setting Up</Card.Title>
                            <Card.Text>
                                <ol>
                                    <li>
                                        <b>Select Machine:</b>
                                        <ul>
                                            <li>Click on the drop-down button to select the machine. You can choose a specific machine or all machines from one category.</li>
                                            <li>Click "Submit" to proceed.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Select Date and a Target:</b>
                                        <ul>
                                            <li>The calendar will be populated based on checking date of available image data. Click to select a Check Date.</li>
                                            <li>Click on a thumbnail to select a target object.</li>
                                            <li>Click on the "Start" button to go to the next screen.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Card.Text>
                            <Card.Img style= {{width: "329px", height: "635px", display: "block", margin: "0 auto" }} variant="top" src={setup_screen_image} alt="Setup screen" />
                            <br></br>
                            <Card.Title as="h4">Selecting and Reviewing Images</Card.Title>
                            <Card.Text>
                                <ol>
                                    <li>
                                        <b>Interface Elements:</b>
                                        <ul>
                                            <li><b>Count:</b> Displays the number of selected images.</li>
                                            <li><b>Target:</b> Shows the active target object.</li>
                                            <li><b>Info Button:</b> Click to access supplementary information or review instructions.</li>
                                            <li><b>Close Button:</b> Exits the current screen.</li>
                                            <li><b>Full Screen Button:</b> Maximizes the current screen, useful when viewing the program on smartphone devices.</li>
                                            <li><b>Submit Button:</b> Submits your selections.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Select an Image:</b>
                                        <ul>
                                            <li>Click on any thumbnail to select it. Selected images will have a blue border. Hovered images will have a green border (for desktop browsers).</li>
                                            <li>Select all image thumbnails that match the target object.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Confirm the Selection:</b>
                                        <ul>
                                            <li>Once all matching thumbnails are selected, press the Submit button.</li>
                                            <li>A confirmation screen will appear. If you are satisfied with your selection, press the Submit option to finalize.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Card.Text>
                            <Card.Img style= {{width: "418px", height: "902px", display: "block", margin: "0 auto" }} variant="top" src={selection_screen_image} alt="Selection screen" />
                            <br></br>
                            <Card.Title as="h4">Continuing Your Session or Logging Out</Card.Title>
                            <Card.Text>
                                After you have completed selecting and reviewing images, you can continue working on other check dates or log out to conclude your session.
                                <ol>
                                    <li>
                                        <b>Continue with Other Check Dates:</b>
                                        <ul>
                                            <li>Navigate back to the home screen, click on the "Get Started" to view and select another check date.</li>
                                            <li>Repeat the process of selecting and reviewing images for the new check date.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Logout:</b>
                                        <ul>
                                            <li>Navigate back to the home screen.</li>
                                            <li>Select the "Logout" option to safely exit the system. Please remember to logout after every session.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Card.Text>
                            <br></br>
                            <Card.Title as="h4">Admin Interface</Card.Title>
                            <Card.Text>
                                The admin interface provides additional tools and resources for administrators to manage the system effectively.
                                <ol>
                                    <li>
                                        <b>Dashboard:</b>
                                        <ul>
                                            <li>Displays a line graph metric overview, showing system performance over time.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Resources:</b>
                                        <ul>
                                            <li><b>Users:</b> Contains details of operators along with their session records.</li>
                                            <li><b>Images:</b> Provides a paginated list of images in the database.</li>
                                            <li><b>Corrections:</b> Displays a paginated list of proposed corrections from users.</li>
                                            <li><b>Metrics:</b> Contains entries to the metrics along with timestamps.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Manual Operations:</b>
                                        <ul>
                                            <li><b>Start Metrics Calculation:</b> Click this button to manually initiate the calculation of metrics from the user-submitted corrections. This operation creates a new metric timestamp with the latest calculations (automatically runs every hour).</li>
                                            <li><b>Start Directory Scan:</b> Click this button to manually start scanning the directory to create new image entries from the detection system outputs. This operation scans and updates the database with new images (automatically runs every day).</li>
                                        </ul>
                                    </li>
                                </ol>
                            </Card.Text>
                            <Card.Img style= {{width: "595px", height: "366px", display: "block", margin: "0 auto" }} variant="top" src={admin_dashboard_image} alt="Admin dashboard" />
                            <br></br>
                            <Card.Title as="h4">Conclusion</Card.Title>
                            <Card.Text>
                                Thank you for your effort in ensuring the accuracy of the detection system. Your feedback is invaluable in improving our service. Happy checking!
                                This manual should help you navigate and utilize the Image Checking System effectively. If you encounter any issues or have questions, don't hesitate to reach out to our support team.
                            </Card.Text>
                            <Button variant="primary" onClick={() => alert('Support Contacted!')}>Contact Support</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutScreen;
