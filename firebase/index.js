var admin = require("firebase-admin");
const express = require('express');
const app = express()
// const { initializeApp } = require('firebase-admin/app');
const googleStorage = require('@google-cloud/storage');
var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://fir-6ea31.appspot.com'
});

const bucket = admin.storage().bucket()

exports.fileUpload = (file) => {
    bucket.upload(file);

    // return file Path..
}