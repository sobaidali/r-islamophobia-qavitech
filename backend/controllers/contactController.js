const users = require('../models/userModel');
const dynamic_helpers = require('../helpers/DynamicsHelper');
const DynamicsConnector = require("../helpers/DynamicsHelper");

const dynamics = require('../constants/constants');

const { dynamicsTenantId, dynamicsHost, dynamicsClientId, dynamicsUserName, dynamicsPassword } = dynamics

//initialize a CRM entity record object
exports.createContact = async (title, fname, lname, email, gender, phoneNumber, streetAddress, subUrb, postCode, state, purpose) => {
    return new Promise((resolve, reject) => {
        const dynamicsConnector = DynamicsConnector(
            dynamicsTenantId,
            dynamicsHost,
            dynamicsClientId,
            dynamicsUserName,
            dynamicsPassword).dynamicsWebApi;
        var newUser = {
            jobtitle: title,
            firstname: fname,
            lastname: lname,
            emailaddress1: email,
            gendercode: 100000000+parseInt(gender),
            mobilephone: phoneNumber,
            address1_line1: streetAddress,
            address1_line2: subUrb,
            address1_postalcode: postCode,
            address1_stateorprovince: state,
            description: purpose
        };

        dynamicsConnector.create(newUser, "contacts").then(function (id) {
            //do something with a record here
            //var subject = record.subject;
            resolve(id)

        }).catch(function (error) {
            //catch error here
            reject(error)
        });
    })
}