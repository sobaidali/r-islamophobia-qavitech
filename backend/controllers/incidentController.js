const DynamicsConnector = require("../helpers/DynamicsHelper");
const dynamics = require('../constants/constants');
const User = require('../models/userModel');
var fs = require("fs");
const { encode } = require("punycode");
const upload = require('../fileuploader/uploader')
const validator = require('validator');

const { dynamicsTenantId, dynamicsHost, dynamicsClientId, dynamicsUserName, dynamicsPassword } = dynamics
exports.users_incident_docupload=async(req,res)=>{
    try{
    upload.array("incidentdocs", 5)(req,res,(err)=>{
        if(req.filetypeerror){
            return res.status(500).json({ message: 'Invalid file type' });
        }
        
        if(err){
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(500).json({ message: 'Too many files to upload.' });
            }
            return res.status(500).json({ message: err.message });
        }
        if(req.files.length<=0){
            return res.status(500).json({ message: 'You must select at least 1 file.' });
        }
        let filenamearr=[]
        req.files.forEach(file => {
            filenamearr.push(file.filename)
        });

            
        return res.status(201).send({message: 'file uploaded',filenames:filenamearr});
    });
    } catch(e){
        return res.status(500).json({ message: 'file upload failed',e });
    }
    
}
const multiSelectHandler=(input)=>{
    let result=''
    for(let i=0;i<input.length;i++){
        var temp=input[i]+100000000
        result+=temp.toString()
        if(i<input.length-1){
            result+=','
        }
    }
    return result
}
const readfile=(name)=>{
        let encodedimage = new Buffer(fs.readFileSync('uploads/'+name), 'binary').toString('base64');
        return encodedimage
}
exports.users_add_incident_short=async (req,res)=>{
    if(!req.body.email){
        return res.status(500).send({message: "Email not provided"});
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(500).send({message: "Invalid Email"});
    }
    if(!req.body.description){
        return res.status(500).send({message: "Description not provided"});
    }
    if(req.body.description.length<=2){
        return res.status(500).send({message: "Description not provided"});
    }
    let emailfound=false
    const dynamicsConnector = DynamicsConnector(
            dynamicsTenantId,
            dynamicsHost,
            dynamicsClientId,
            dynamicsUserName,
            dynamicsPassword).dynamicsWebApi;
    await dynamicsConnector.retrieveAll("contacts", ["emailaddress1"], "emailaddress1 eq '"+req.body.email+"'").then( async function (response) {
        var records = response.value;
        if(records.length>0){
            emailfound=true
            var addIncident={
                new_contactid:records[0].contactid,
                new_canyoutellusabouttheincident:req.body.description,
                "cr92f_Contact@odata.bind": "/contacts("+records[0].contactid+")"
            };
            await dynamicsConnector.create(addIncident, "new_incidents").then(function (id) {
                //do something with a record here
                return res.status(200).json({ message: 'Incident added',incidentID:id,contactID:records[0].contactid});
                  
            }).catch(function (error) {
                //catch error here
                console.log(error)
                return res.status(500).send({message: "Incident not added",error});  
            });
        }
    }).catch(function (error){
        emailfound=true
    });
    if(emailfound==false){
        let promise = new Promise((resolve, reject) => {
            // v=Victim and p=Preparator
            var newContact={
                emailaddress1: req.body.email
            };
            dynamicsConnector.create(newContact, "contacts").then(function (id1) {
                //do something with a record here
                resolve(id1)
    
            }).catch(function (error) {
                //catch error here
                reject(error)
            });
        });
        promise.then((id1)=>{
            // v=Victim and p=Preparator
            var addIncident={
                new_contactid:id1,
                new_canyoutellusabouttheincident:req.body.description,
                "cr92f_Contact@odata.bind": "/contacts("+id1+")"
            };
            dynamicsConnector.create(addIncident, "new_incidents").then(function (id) {
                //do something with a record here
                return res.status(200).json({ message: 'Incident added',incidentID:id,contactID:id1});
                
            }).catch(function (error) {
                //catch error here
                console.log(error)
                return res.status(500).send({message: "Incident not added",error});  
            });
        })
        .catch((err)=>{
            console.log(err)
        return res.status(500).json({ message: 'Incident not added' });
        })
    }
    
    
  }
exports.nonusers_add_incident= async (req, res) => {
    let date1=new Date()
    req.body.date1!==undefined ? req.body.date1.length>4 ? date1=new Date(req.body.date1):null:null
    let image1='';
    let image2='';
    let image3='';
    let image4='';
    let image5='';
    req.body.filename1!==undefined ? req.body.filename1.length>4 ? image1 = readfile(req.body.filename1):null:null
    req.body.filename2!==undefined ? req.body.filename2.length>4 ? image2 = readfile(req.body.filename2):null:null
    req.body.filename3!==undefined ? req.body.filename3.length>4 ? image3 = readfile(req.body.filename3):null:null
    req.body.filename4!==undefined ? req.body.filename4.length>4 ? image4 = readfile(req.body.filename4):null:null
    req.body.filename5!==undefined ? req.body.filename5.length>4 ? image5 = readfile(req.body.filename5):null:null
    let emotionsfelt=''
    let incidenttype=''
    req.body.type!==undefined ? req.body.type.length>0 ? incidenttype=multiSelectHandler(req.body.type):null:null
    req.body.emotionsFelt!==undefined ? req.body.emotionsFelt.length>0 ? emotionsfelt=multiSelectHandler(req.body.emotionsFelt):null:null
    if(req.body.idescription){
        let promise = new Promise((resolve, reject) => {
            const dynamicsConnector = DynamicsConnector(
                dynamicsTenantId,
                dynamicsHost,
                dynamicsClientId,
                dynamicsUserName,
                dynamicsPassword).dynamicsWebApi;
                // v=Victim and p=Preparator
                var newIncident={
                    //new_contactid:user1.details_id,
                    new_canyoutellusabouttheincident:req.body.idescription
                };
                console.log(req.body.submitBy)
                req.body.townorcity!==undefined? (newIncident.new_townorcity)=req.body.townorcity:null
                req.body.streetname!==undefined? (newIncident.new_streetname)=req.body.streetname:null
                req.body.postcode!==undefined? (newIncident.new_postcode)=req.body.postcode:null
                req.body.cctvinthearea || req.body.cctvinthearea==0? req.body.cctvinthearea<=2? (newIncident.new_areyouawareofcctvinthearea)=req.body.cctvinthearea+100000000:null:null
                req.body.anywitnessespresent || req.body.anywitnessespresent==0 ? req.body.anywitnessespresent<=2? (newIncident.new_werethereanywitnessespresent)=req.body.anywitnessespresent+100000000:null:null
                req.body.submitBy || req.body.submitBy==0? req.body.submitBy<=2 ? (newIncident.new_whoisfillingoutthisform)=req.body.submitBy+100000000:null:null
                req.body.witnessedOrExperienced || req.body.witnessedOrExperienced==0? req.body.witnessedOrExperienced<=1 ? (newIncident.new_theincidentwasexperiencedwitnessed)=req.body.witnessedOrExperienced+100000000:null:null
                req.body.type!==undefined? req.body.type.length>0 ?(newIncident.new_typeofincident)=incidenttype:null:null
                req.body.date1!==undefined? (newIncident.new_dateandtimeonwhichincidenthappened)=date1:null
                req.body.emotionsFelt!==undefined? req.body.emotionsFelt.length>0 ? (newIncident.new_emotionsyoufeltfollowingincident)=emotionsfelt:null:null
                req.body.reportedToPolice!==undefined  && req.body.reportedToPolice!=""? (newIncident.new_haveyoureportedtopolice)=req.body.reportedToPolice:null
                req.body.longTermImpact!==undefined? (newIncident.new_incidentleftanylongtermimpact)=req.body.longTermImpact:null
                req.body.registerForwardCopy!==undefined && req.body.registerForwardCopy!=""? (newIncident.new_registertoforwardacopyofthisreport)=req.body.registerForwardCopy:null
                req.body.filename1!==undefined? (newIncident.new_supportingdocuments)=image1:null
                req.body.vgender || req.body.vgender==0? req.body.vgender<=2 ? (newIncident.new_victimsgender)=req.body.vgender+100000000:null:null
                req.body.vreligiousClothing || req.body.vreligiousClothing==0? req.body.vreligiousClothing<=2 ? (newIncident.new_victimwearinganyreligiousclothing)=req.body.vreligiousClothing+100000000:null:null
                req.body.vageGroup || req.body.vageGroup==0? req.body.vageGroup<=7 ? (newIncident.new_victimsagegroup)=req.body.vageGroup+100000000:null:null
                req.body.vethinicity!==undefined? (newIncident.new_victimsethnicity)=req.body.vethinicity:null
                req.body.pgender || req.body.pgender==0? req.body.pgender<=2 ? (newIncident.new_perpetratorsgender)=req.body.pgender+100000000:null:null
                req.body.pageGroup || req.body.pageGroup==0? req.body.pageGroup<=6 ? (newIncident.new_perpetratorsagegroup)=req.body.pageGroup+100000000:null:null
                req.body.pethinicity!==undefined? (newIncident.new_perpetratorsethnicity)=req.body.pethinicity:null 
                console.log(newIncident)
    
                dynamicsConnector.create(newIncident, "new_incidents").then(function (id) {
                    //do something with a record here
                    resolve(id)
        
                }).catch(function (error) {
                    //catch error here
                    reject(error)
                });
            });
        promise.then((id)=>{
            if(req.body.filename2){
                const dynamicsConnector = DynamicsConnector(
                    dynamicsTenantId,
                    dynamicsHost,
                    dynamicsClientId,
                    dynamicsUserName,
                    dynamicsPassword).dynamicsWebApi;
                // v=Victim and p=Preparator
                var updatedIncident={
                    new_supportingdocuments2:image2
                };
                req.body.filename3!==undefined? (updatedIncident.new_supportingdocuments3)=image3:null
                req.body.filename4!==undefined? (updatedIncident.new_supportingdocuments4)=image4:null
                req.body.filename5!==undefined? (updatedIncident.new_supportingdocuments5)=image5:null      
                dynamicsConnector.update(id, "new_incidents",updatedIncident).then(function () {
                        return res.status(200).json({ message: 'Incident added'});
                    })
                    .catch(function (error) {
                        console.log(error)
                        return res.status(500).send({message: "Incident not added",error}); 
                    });
            }else{
                return res.status(200).json({ message: 'Incident added'});
            }
        })
        .catch((err)=>{
            console.log(err)
          return res.status(500).json({ message: 'Incident not added' });
        })
    }else{
        return res.status(500).json({ message: 'Incident not added, description is required' });
    }
}

exports.users_add_incident=async (req,res)=>{
    payload=req.decoded
    let user1=null
    try{
        user1=await User.findOne({ email: payload.email }).exec();
    }catch(err){
        return res.status(500).json({ message: "Database error" })
    }
    if(!user1.details_id){
        return res.status(500).json({ message: "User doesn't have a contact record" })
    }
    let date1=new Date()
    req.body.date1!==undefined ? req.body.date1.length>4 ? date1=new Date(req.body.date1):null:null
    let image1='';
    let image2='';
    let image3='';
    let image4='';
    let image5='';
    req.body.filename1!==undefined ? req.body.filename1.length>4 ? image1 = readfile(req.body.filename1):null:null
    req.body.filename2!==undefined ? req.body.filename2.length>4 ? image2 = readfile(req.body.filename2):null:null
    req.body.filename3!==undefined ? req.body.filename3.length>4 ? image3 = readfile(req.body.filename3):null:null
    req.body.filename4!==undefined ? req.body.filename4.length>4 ? image4 = readfile(req.body.filename4):null:null
    req.body.filename5!==undefined ? req.body.filename5.length>4 ? image5 = readfile(req.body.filename5):null:null
    let emotionsfelt=''
    let incidenttype=''
    req.body.type!==undefined ? req.body.type.length>0 ? incidenttype=multiSelectHandler(req.body.type):null:null
    req.body.emotionsFelt!==undefined ? req.body.emotionsFelt.length>0 ? emotionsfelt=multiSelectHandler(req.body.emotionsFelt):null:null
    if(req.body.idescription){
        let promise = new Promise((resolve, reject) => {
            const dynamicsConnector = DynamicsConnector(
                dynamicsTenantId,
                dynamicsHost,
                dynamicsClientId,
                dynamicsUserName,
                dynamicsPassword).dynamicsWebApi;
                // v=Victim and p=Preparator
                var newIncident={
                    new_contactid:user1.details_id,
                    new_canyoutellusabouttheincident:req.body.idescription,
                    "cr92f_Contact@odata.bind": "/contacts("+user1.details_id+")"
                };
                console.log(req.body.submitBy)
                req.body.townorcity!==undefined? (newIncident.new_townorcity)=req.body.townorcity:null
                req.body.streetname!==undefined? (newIncident.new_streetname)=req.body.streetname:null
                req.body.postcode!==undefined? (newIncident.new_postcode)=req.body.postcode:null
                req.body.cctvinthearea || req.body.cctvinthearea==0? req.body.cctvinthearea<=2? (newIncident.new_areyouawareofcctvinthearea)=req.body.cctvinthearea+100000000:null:null
                req.body.anywitnessespresent || req.body.anywitnessespresent==0 ? req.body.anywitnessespresent<=2? (newIncident.new_werethereanywitnessespresent)=req.body.anywitnessespresent+100000000:null:null
                req.body.submitBy || req.body.submitBy==0? req.body.submitBy<=2 ? (newIncident.new_whoisfillingoutthisform)=req.body.submitBy+100000000:null:null
                req.body.witnessedOrExperienced || req.body.witnessedOrExperienced==0? req.body.witnessedOrExperienced<=1 ? (newIncident.new_theincidentwasexperiencedwitnessed)=req.body.witnessedOrExperienced+100000000:null:null
                req.body.type!==undefined? req.body.type.length>0 ?(newIncident.new_typeofincident)=incidenttype:null:null
                req.body.date1!==undefined? (newIncident.new_dateandtimeonwhichincidenthappened)=date1:null
                req.body.emotionsFelt!==undefined? req.body.emotionsFelt.length>0 ? (newIncident.new_emotionsyoufeltfollowingincident)=emotionsfelt:null:null
                req.body.reportedToPolice!==undefined  && req.body.reportedToPolice!=""? (newIncident.new_haveyoureportedtopolice)=req.body.reportedToPolice:null
                req.body.longTermImpact!==undefined? (newIncident.new_incidentleftanylongtermimpact)=req.body.longTermImpact:null
                req.body.registerForwardCopy!==undefined && req.body.registerForwardCopy!=""? (newIncident.new_registertoforwardacopyofthisreport)=req.body.registerForwardCopy:null
                req.body.filename1!==undefined? (newIncident.new_supportingdocuments)=image1:null
                req.body.vgender || req.body.vgender==0? req.body.vgender<=2 ? (newIncident.new_victimsgender)=req.body.vgender+100000000:null:null
                req.body.vreligiousClothing || req.body.vreligiousClothing==0? req.body.vreligiousClothing<=2 ? (newIncident.new_victimwearinganyreligiousclothing)=req.body.vreligiousClothing+100000000:null:null
                req.body.vageGroup || req.body.vageGroup==0? req.body.vageGroup<=7 ? (newIncident.new_victimsagegroup)=req.body.vageGroup+100000000:null:null
                req.body.vethinicity!==undefined? (newIncident.new_victimsethnicity)=req.body.vethinicity:null
                req.body.pgender || req.body.pgender==0? req.body.pgender<=2 ? (newIncident.new_perpetratorsgender)=req.body.pgender+100000000:null:null
                req.body.pageGroup || req.body.pageGroup==0? req.body.pageGroup<=6 ? (newIncident.new_perpetratorsagegroup)=req.body.pageGroup+100000000:null:null
                req.body.pethinicity!==undefined? (newIncident.new_perpetratorsethnicity)=req.body.pethinicity:null 
                console.log(newIncident)
    
                dynamicsConnector.create(newIncident, "new_incidents").then(function (id) {
                    //do something with a record here
                    resolve(id)
        
                }).catch(function (error) {
                    //catch error here
                    reject(error)
                });
            });
        promise.then((id)=>{
            if(req.body.filename2){
                const dynamicsConnector = DynamicsConnector(
                    dynamicsTenantId,
                    dynamicsHost,
                    dynamicsClientId,
                    dynamicsUserName,
                    dynamicsPassword).dynamicsWebApi;
                // v=Victim and p=Preparator
                var updatedIncident={
                    new_supportingdocuments2:image2
                };
                req.body.filename3!==undefined? (updatedIncident.new_supportingdocuments3)=image3:null
                req.body.filename4!==undefined? (updatedIncident.new_supportingdocuments4)=image4:null
                req.body.filename5!==undefined? (updatedIncident.new_supportingdocuments5)=image5:null      
                dynamicsConnector.update(id, "new_incidents",updatedIncident).then(function () {
                        return res.status(200).json({ message: 'Incident added'});
                    })
                    .catch(function (error) {
                        console.log(error)
                        return res.status(500).send({message: "Incident not added",error}); 
                    });
            }else{
                return res.status(200).json({ message: 'Incident added'});
            }
        })
        .catch((err)=>{
            console.log(err)
          return res.status(500).json({ message: 'Incident not added' });
        })
    }else{
        return res.status(500).json({ message: 'Incident not added, description is required' });
    }
    
  }
  exports.users_get_incidents=async (req,res)=>{
    payload=req.decoded
    let linkpresent=true
    let size=10
    let request={}
    User.findOne({ _id: payload.userId },async function(err,user1){
        if(err){
            return res.status(500).send({message: "database error",error:err});
        }
        if(!user1){
            return res.status(500).send({message: "user not found"}); 
        }
        const dynamicsConnector = DynamicsConnector(
          dynamicsTenantId,
          dynamicsHost,
          dynamicsClientId,
          dynamicsUserName,
          dynamicsPassword).dynamicsWebApi;
        if(!req.body.oDataLink){
            linkpresent=false
        }
        if(req.body.oDataLink){
            if(req.body.oDataLink.length<=1){
                linkpresent=false
            }
        }
        if(req.body.pagesize){
            if(req.body.pagesize>0){
                size=req.body.pagesize
            }
        }
        if(linkpresent==false){
            request={
                collection: "new_incidents",
                select: [
                "new_contactid",
                "new_canyoutellusabouttheincident",
                "new_townorcity",
                "new_streetname",
                "new_postcode",
                "new_areyouawareofcctvinthearea",
                "new_werethereanywitnessespresent",
                "new_whoisfillingoutthisform",
                "new_theincidentwasexperiencedwitnessed",
                "new_typeofincident",
                "new_dateandtimeonwhichincidenthappened",
                "new_emotionsyoufeltfollowingincident",
                "new_haveyoureportedtopolice",
                "new_incidentleftanylongtermimpact",
                "new_registertoforwardacopyofthisreport",
                "new_supportingdocuments",
                "new_victimsgender",
                "new_victimwearinganyreligiousclothing",
                "new_victimsagegroup",
                "new_victimsethnicity",
                "new_perpetratorsgender",
                "new_perpetratorsagegroup",
                "new_perpetratorsethnicity",
                "new_supportingdocuments2",
                "new_supportingdocuments3",
                "new_supportingdocuments4",
                "new_supportingdocuments5"],
                filter: "new_contactid eq '"+user1.details_id+"'",
                orderBy:["createdon desc"],
                maxPageSize:size
            };
            await dynamicsConnector.retrieveMultipleRequest(request).then(function (record) {
                let newrecord={
                    data:record.value
                }
                if(record.oDataNextLink){
                    newrecord.oDataLink=record.oDataNextLink
                }
              return res.status(200).json({ message: 'Incidents found',newrecord});
            })
            .catch(function (error) {
                console.log(error)
              return res.status(500).send({message: "Incidents not found",error}); 
            });
        }
        else{
            request={}
            request={
                maxPageSize:size
            };
            await dynamicsConnector.retrieveMultipleRequest(request,oDataLink=req.body.oDataLink).then(function (record) {
                let newrecord={
                    data:record.value
                }
                if(record.oDataNextLink){
                    newrecord.oDataLink=record.oDataNextLink
                }
                return res.status(200).json({ message: 'Incidents found',newrecord});
            })
            .catch(function (error) {
                console.log(error)
                return res.status(500).send({message: "Incidents not found",error}); 
            });
        }        
    });    
}
    
