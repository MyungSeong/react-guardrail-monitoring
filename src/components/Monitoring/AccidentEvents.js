import React, {Component} from 'react';
import * as AccidentApi from './marker/api/Api';

import {Card, Table, Button, Modal} from 'react-bootstrap';

import Aux from '../../hoc/_Aux';

import exclamationMarkIcon from '../../assets/images/exclamation_mark.gif';
import checkMarkIcon from '../../assets/images/check_mark.png';

import CONSTANT from "../../constant";
import * as GuardrailApi from './api/GuardrailApi';
import {dateFormatConverter} from "./utils";

export default class AccidentEvents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accidentInfo: null,
            modalVisible: false,
            selectedGuardrailIndex: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.state.accidentInfo !== nextState.accidentInfo);
    }

    componentDidMount() {
        const getData = async () => {
            await this.handleGetAccidentInfo();
        };

        getData();

        this.interval = setInterval(() => this.handleGetAccidentInfo(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async handleGetAccidentInfo() {
        const result = await AccidentApi.getAccidentInfo();

        this.setState({accidentInfo: result});
    };

    handleToggleModal = (index) => {
        this.setState(prevState => ({modalVisible: !prevState.modalVisible, selectedGuardrailIndex: index - 1}));
    };

    handleCloseModal = (e) => {
        if (e) e.preventDefault();

        this.setState({modalVisible: false});
    };

    async handleFixGuardrail(index) {
        await GuardrailApi.postFixGuardrail({index: index});

        this.handleGetAccidentInfo();
        this.handleCloseModal();
    };

    handleRenderModal = () => {
        const data = this.state.accidentInfo && this.state.accidentInfo[this.state.selectedGuardrailIndex];
        const id = this.state.selectedGuardrailIndex + 1;
        const address = data && data.cityprovinceName + ' ' + data.districtName + ' ' + data.emdName + ' ' + data.roadName;
        const date = data && dateFormatConverter(data.accidentDate, null, 'MDhms');
        const state = data && data.guardrailState === '1' ? '사고 발생' : '수리 완료';

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
                    <h4 className='text-center'>{id}번 가드레일</h4>
                    <p className='text-center' style={
                        {color: 'crimson'}
                    }>
                        발생 지역: {address}<br/>
                        발생 시각: {date}<br/>
                        가드레일 상태: {state}<br/>
                    </p>
                    <p className='text-center'>
                        수리 완료 상태로 변경할까요?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={() => this.handleFixGuardrail(id)}>Submit</Button>
                    <Button variant='secondary' onClick={this.handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    };

    handleRenderAccidentEventsTable = () => {
        return (
            this.state.accidentInfo &&
            this.state.accidentInfo.map((data, index, array) => {
                const address = data.cityprovinceName + ' ' + data.districtName + ' ' + data.emdName + ' ' + data.roadName;
                const date = dateFormatConverter(data.accidentDate, null, 'MDhms');
                const state = data.guardrailState;

                return (
                    <tr key={index} className="unread">
                        <td>
                            {state === '1' ?
                                <img className="rounded-circle"
                                     style={{width: '85px', filter: 'saturate(100) hue-rotate(238deg)'}}
                                     src={exclamationMarkIcon} alt="exclamationMarkIcon"/> :
                                <img className="rounded-circle"
                                     style={{width: '40px', marginLeft:'20px'}}
                                     src={checkMarkIcon} alt="checkMarkIcon"/>}
                        </td>
                        <td>
                            <h6 className="mb-1">지역</h6>
                            <p className="m-0">
                                {address}
                            </p>
                        </td>
                        <td>
                            <h6 className="mb-1">발생 시각</h6>
                            <h6 className="text-muted">
                                {state === '1' ?
                                    <i className="fa fa-circle text-c-red f-10 m-r-15"/> :
                                    <i className="fa fa-circle text-c-green f-10 m-r-15"/>}
                                {date}
                            </h6>
                        </td>
                        {state === '1' ?
                            <td>
                                <a href={CONSTANT.BLANK_LINK} className="label theme-bg2 text-white f-12"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       const coord = {
                                           lat: this.state.accidentInfo[index].guardrailLatitude,
                                           lng: this.state.accidentInfo[index].guardrailLongitude
                                       };
                                       this.props.morph(coord, 8, {duration: 2000, easing: 'easeOutCubic'});
                                   }}
                                >Move to marker</a>
                                <a href={CONSTANT.BLANK_LINK} className="label theme-bg text-white f-12"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       this.handleToggleModal(this.state.accidentInfo[index].guardrailID);
                                   }}
                                >Done</a>
                            </td> : <td/>
                        }
                    </tr>
                )
            })
        );
    };

    render() {
        return (
            <Aux>
                {this.handleRenderModal()}
                <Card className='Recent-Users'>
                    <Card.Header>
                        <Card.Title as='h5'>List of accidents</Card.Title>
                    </Card.Header>
                    <Card.Body className='px-0 py-2'>
                        <Table responsive hover>
                            <tbody>
                                {this.handleRenderAccidentEventsTable()}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Aux>
        );
    }
}

AccidentEvents.defaultProps = {
    morph: () => {}
};