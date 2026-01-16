import * as Notifications from 'expo-notifications';

export const sendLocalNotification = async (
  title: string,
  body: string
) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
};
