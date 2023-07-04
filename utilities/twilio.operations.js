const twilio = require('twilio');
require('dotenv').config();

exports.sendInvitationMessage = async (data) => {
    const client = new twilio(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTH_TOKEN);
    try {
        const message = await client.messages
        .create({body: `Hello there, Mr. Dunia is inviting you to the wedding ceremony of their daughter Dunia Margaret and his beloved Nehemia 
            Benjamin, please follow the link below to confirm your presence. ${data.link}`, from: process.env.PHONE_NUMBER, to: data.receiver});
            console.log(message);
            return message;
    } catch(err) {
        console.log(err);
        return err;
    }   
}