export default function sendNotif(data) {
    if(Notification.permission === 'granted') {
        let options = {
            body: data.body,
            icon: data.icon ? data.icon : null,
            dir: 'ltr'
        };
        const notification = new Notification(data.title, options);
        notification.close();
    }
}