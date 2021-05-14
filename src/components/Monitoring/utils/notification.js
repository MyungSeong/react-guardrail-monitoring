import React from 'react';
import Notification from 'react-web-notification';
import * as Util from './index';
import MQTT from "../mqtt/mqtt";

import Aux from "../../../hoc/_Aux";

import * as CONSTANT from "../../../constant";
import notificationIcon from '../../../assets/images/notification_blue.png'

export default class WebNotification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ignore: true,
            title: ''
        };

        this.handleSetNotification = this.handleSetNotification.bind(this);
    }

    handlePermissionGranted() {
        console.log('Permission Granted');
        this.setState({
            ignore: false
        });
    }

    handlePermissionDenied() {
        console.log('Permission Denied');
        this.setState({
            ignore: true
        });
    }

    handleNotSupported() {
        console.log('Web Notification not Supported');
        this.setState({
            ignore: true
        });
    }

    handleNotificationOnClick(e, tag) {
        console.log(e, 'Notification clicked tag:' + tag);
    }

    handleNotificationOnError(e, tag) {
        console.log(e, 'Notification error tag:' + tag);
    }

    handleNotificationOnClose(e, tag) {
        console.log(e, 'Notification closed tag:' + tag);
    }

    handleNotificationOnShow(e, tag) {
        //this.playSound();
        console.log(e, 'Notification shown tag:' + tag);
    }

    playSound(filename) {
        document.getElementById('sound').play();
    }

    handleSetNotification(data) {
        if (this.state.ignore) {
            return;
        }

        const dateString = Util.dateFormatConverter(new Date());

        const title = '사고 발생!';
        const body = '발생 시각: ' + dateString + '\n' + 'Message: ' + data.message;
        const tag = Date.now(); // not working?
        const icon = notificationIcon;

        // Available options
        // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
        const options = {
            tag: tag,
            body: body,
            icon: icon,
            requireInteraction: false,
            //dir: 'ltr',
            /*actions: [{
                title: '액션 1',
                action: 'action-1'
            }, {
                title: '액션 2',
                action: 'action-2'
            }],*/
            //sound: ''  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
        };

        this.setState({
            title: title,
            options: options
        });
    }

    render() {
        return (
            <Aux>
                {/*<Button variant={'info'} onClick={this.handleSetNotification.bind(this)}>Notif!</Button>*/}
                <Notification
                    ignore={this.state.ignore && this.state.title !== ''}
                    notSupported={this.handleNotSupported.bind(this)}
                    onPermissionGranted={this.handlePermissionGranted.bind(this)}
                    onPermissionDenied={this.handlePermissionDenied.bind(this)}
                    onShow={this.handleNotificationOnShow.bind(this)}
                    onClick={this.handleNotificationOnClick.bind(this)}
                    onClose={this.handleNotificationOnClose.bind(this)}
                    onError={this.handleNotificationOnError.bind(this)}
                    timeout={0}
                    title={this.state.title}
                    options={this.state.options}
                />

                {/*<audio id='sound' preload='auto'>
                    <source src='./sound.mp3' type='audio/mpeg' />
                    <source src='./sound.ogg' type='audio/ogg' />
                    <embed hidden={true} autostart='false' loop={false} src='./sound.mp3' />
                </audio>*/}

                <MQTT notification={this.handleSetNotification}/>
            </Aux>
        )
    }
}