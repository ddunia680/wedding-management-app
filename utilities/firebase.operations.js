const storage = require('../firebase.config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.storeAPic = async (file) => {
    const timestamps = Date.now();
    const nm = file.originalname.split('.')[0];
    const type = file.originalname.split('.')[1];
    const filename = `${nm}_${timestamps}.${type}`;

    const imageRef = ref(storage, `twitter/guestsPics/${filename}`);
    const snapshot = await uploadBytes(imageRef, file.buffer);
    console.log('profile uploaded');
    const url = await getDownloadURL(snapshot.ref);
    return url;
}