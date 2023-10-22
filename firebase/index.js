const express = require('express');
const app = express();
require('dotenv').config();
const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const { signInAnonymously } = require('firebase/auth');
const appFB = require('./firebaseconfig');

const uploadImage = async (quentity) => {
    const storageFB = getStorage();

    await signInAnonymously(appFB);

    if (quentity === 'single') {
        const dateTime = Date.now();
        const fileName = `images/${dateTime}`;
        const storageRef = ref(storageFB, fileName);
        // const metaData = {
        //     contentType: file.type,
        // };
        await uploadBytesResumable(storageRef);
        // await uploadBytesResumable(storageRef, file.buffer, metaData);

        return fileName;
    }
}

module.exports = { uploadImage }