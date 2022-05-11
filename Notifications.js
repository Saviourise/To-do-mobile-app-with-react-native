/* eslint-disable prettier/prettier */
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
class Notifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        //console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        //console.log('NOTIFICATION:', notification);
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      //requestPermissions: true,
      requestPermissions: Platform.Os === 'ios',
      // IOS ONLY (optional): default: all - Permissions to register.
      //   permissions: {
      //     alert: true,
      //     badge: false,
      //     sound: false,
      //   },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      //console.log('SN --- ', rn);
    });
  }

  schduleNotification(date, message) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: message,
      message: '🔔 Reminder! You are supposed to do this task right now.',
      date,
    });
  }
}

export default new Notifications();
