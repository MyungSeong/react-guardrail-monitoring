import React, { Component } from 'react';
import * as MQTTApi from './api/Api';

import {Button, Dropdown, DropdownButton, FormControl, InputGroup} from 'react-bootstrap';

import Aux from "../../../hoc/_Aux";

import mqttServices from './api/Websocket';

export default class MQTT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mqttData: null,
            topic: '',
            message: '',
            mqtt: {
                topic: '',
                message: ''
            }
        };
    }

    componentDidMount() {
        /*
         * Initiating connection
         *
        useEffect(() => {
            const client = mqttService.getClient(storeError);
            storeMqttClient(client);
            const callBack = (mqttMessage) => handleMessage(mqttMessage);
            mqttService.onMessage(client, callBack);
            return () => mqttService.closeConnection(client);
        }, []);
        */
        /*
         * Subscribing and unsubscribing from MQTT topics
         *
        function rowSelectionHandler(newTopic) {
            const topicHasChanged = // Check if I the topic has changed
            const topic = // The current topic
            if (topicHasChanged) {
                mqttService.unsubscribe(mqttClient, topic);
            }
            mqttService.subscribe(mqttClient, newTopic, storeError);
        }
        */
        const client = mqttServices.getClient(console.log);

        mqttServices.subscribe(client, '#', console.log);
        mqttServices.onMessage(client, console.log);
    }

    async handleSendMQTT(data) {
        const result = await MQTTApi.postMessage(data);

        this.setState({mqttData: result});
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleClick = () => {
        if (this.state.topic && this.state.message) {
            const data = {
                topic: this.state.topic,
                message: this.state.message
            };

            const sendMessage = async () => {
                await this.handleSendMQTT(data);
                await this.state.mqttData;

                if (this.state.mqttData[0].errno) {
                    alert('입력값을 확인해주세요\n\n' +
                        'Code: ' + this.state.mqttData[0].code + '\n\n' +
                        'Message: ' + this.state.mqttData[0].sqlMessage);
                } else {
                    this.props.notification(data);

                    this.setState({
                        mqtt: {
                            ...this.state.mqtt,
                            topic: data.topic,
                            message: data.message
                        },
                        topic: '',
                        message: ''
                    });
                }
            };

            sendMessage();
        } else {
            alert('빈 칸이 있는지 확인해주세요');
        }
    };

    render() {
        return (
            <Aux>
                <InputGroup className="mb-3">
                    <DropdownButton as={InputGroup.Prepend} title="Topic" id="input-group-dropdown-1">
                        <Dropdown.Item href="#" onClick={() => this.setState({topic: '26/530/106'})}>1번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({topic: '26/230/108'})}>2번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({topic: '26/350/105'})}>3번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({topic: '26/350/105'})}>4번 가드레일</Dropdown.Item>
                    </DropdownButton>
                    <FormControl
                        name='topic'
                        placeholder="cityprovince/district/emd (e.g. 26/530/106)"
                        value={this.state.topic}
                        onChange={this.handleChange}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <DropdownButton as={InputGroup.Prepend} title="Message" id="input-group-dropdown-1">
                        <Dropdown.Item href="#" onClick={() => this.setState({message: '35.1510807803644,129.006081704281,100,1'})}>1번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({message: '35.19140977178646,128.9902849903807,100,2'})}>2번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({message: '35.16952116144408,129.13841596675306,100,3'})}>3번 가드레일</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item href="#" onClick={() => this.setState({message: '35.16955559722969,129.13832460847368,100,4'})}>4번 가드레일</Dropdown.Item>
                    </DropdownButton>
                    <FormControl
                        name='message'
                        placeholder="lat,lng,colweight,moduleid (e.g. 35.1510807803644,129.006081704281,100,1)"
                        value={this.state.message}
                        onChange={this.handleChange}
                    />
                    <Button variant='secondary' onClick={this.handleClick}>Send</Button>
                </InputGroup>
                {/*<p>Topic :
                    <input
                        type="text"
                        name="topic"
                        placeholder="26/530/106"
                        value={this.state.topic}
                        onChange={this.handleChange}>
                    </input>
                </p>
                <p>Message :
                    <input
                        type="text"
                        name="message"
                        placeholder="lat,long,colweight,moduleid"
                        value={this.state.message}
                        onChange={this.handleChange}>
                    </input>
                </p>
                <Button variant={'secondary'} onClick={this.handleClick}>Send</Button>*/}
            </Aux>
        );
    }
}