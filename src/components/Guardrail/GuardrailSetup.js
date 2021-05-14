import React from 'react';
import {Row, Col, Card, Form, Button, Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import * as GuardrailApi from "./api/GuardrailApi";

class GuardrailSetup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cityprovinceCode: '',
            districtCode: '',
            emdCode: '',
            roadCode: '',
            latitude: '',
            longitude: '',
            modalVisible: false,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    async handleSetupGuardrail(data) {
        const reqCondition = data.cityprovinceCode && data.districtCode && data.emdCode &&
                             data.roadCode && data.latitude && data.longitude;

        if (reqCondition) {
            await GuardrailApi.postSetupGuardrail(data);

            this.handleToggleModal();
        } else {
            alert('빈 칸이 있는지 확인해주세요');
        }
    };

    handleToggleModal = () => {
        this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
    };

    handleCloseModal = (e) => {
        if (e) e.preventDefault();

        this.setState({modalVisible: false});
    };

    handleRenderModal = () => {
        return (
            <Modal
                show={this.state.modalVisible}
                onHide={this.handleToggleModal}
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Guardrail Monitoring System
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>가드레일을 추가하시겠습니까?</h4>
                    <br/>
                    <p className='text-center' style={
                        {color: 'teal'}
                    }>
                        시도 코드: {this.state.cityprovinceCode}<br/>
                        시군구 코드: {this.state.districtCode}<br/>
                        읍면동 코드: {this.state.emdCode}<br/>
                        도로 코드: {this.state.emdCode}<br/><br/>
                        위도 좌표: {this.state.latitude}<br/>
                        경도 좌표: {this.state.longitude}<br/>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.handleSetupGuardrail(
                        { cityprovinceCode: this.state.cityprovinceCode,
                                districtCode: this.state.districtCode,
                                emdCode: this.state.emdCode,
                                roadCode: this.state.roadCode,
                                latitude: this.state.latitude,
                                longitude: this.state.longitude })}
                    >Submit</Button>
                    <Button variant='secondary' onClick={this.handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    };

    render() {
        return (
            <Aux>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Guardrail Management</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h5>Guardrail Setup</h5>
                        <hr/>
                        <Row>
                            <Col md={6}>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>시도 코드</Form.Label>
                                        <Form.Control name="cityprovinceCode" placeholder="Enter cityprovince code"
                                                      value={this.state.cityprovinceCode} onChange={this.handleChange}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>시군구 코드</Form.Label>
                                        <Form.Control name="districtCode" placeholder="Enter district code"
                                                      value={this.state.districtCode} onChange={this.handleChange}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>읍면동 코드</Form.Label>
                                        <Form.Control name="emdCode" placeholder="Enter emd code"
                                                      value={this.state.emdCode} onChange={this.handleChange}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>도로 코드</Form.Label>
                                        <Form.Control name="roadCode" placeholder="Enter road code"
                                                      value={this.state.roadCode} onChange={this.handleChange}/>
                                    </Form.Group>
                                    <Button variant="primary" onClick={() => this.handleToggleModal()}>
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>위도 좌표</Form.Label>
                                    <Form.Control name="latitude" placeholder="Enter latitude coordinates"
                                                  value={this.state.latitude} onChange={this.handleChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>경도 좌표</Form.Label>
                                    <Form.Control name="longitude" placeholder="Enter longitude coordinates"
                                                  value={this.state.longitude} onChange={this.handleChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {this.handleRenderModal()}
            </Aux>
        );
    }
}

export default GuardrailSetup;
