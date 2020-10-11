
const multer  = require('multer');
function getFileExtension(filename) {
    return filename.split('.').pop();
}
const storage=multer.diskStorage({destination: function(req,file,cb){
    if(file.mimetype!=='image/png' && file.mimetype!=='image/jpeg' && file.mimetype!=='image/jpg'){
        req.filetypeerror='invalid image type'
    }
    cb (null,'uploads/');
},filename:function(req,file,cb){
    let timestamp1=new Date().getTime().toString();
    let fullfilename=timestamp1+'.'+getFileExtension(file.originalname);
    cb(null,fullfilename)
}})
const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*2
}})

module.exports = upload;