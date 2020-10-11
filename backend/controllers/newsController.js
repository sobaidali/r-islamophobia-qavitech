const News = require('../models/newsModel');
exports.users_add_news=async (req,res)=>{
    payload=req.decoded
    try{
        let newNewsid='';
        let newNews = new News({ title:req.body.title,news_body:req.body.newsbody,user_id:payload.userId });
        await newNews.save((err,result)=>{
            if(err){
                throw err;
            }
            newNewsid=result._id
            return res.status(201).send({message: "news added",news:newNewsid});
        })
    }catch(error){
        return res.status(500).send({message: "database error"});
    }
}

exports.users_edit_news=async (req,res)=>{
    News.findOne({ _id: req.body.newsid },function(err,news){
        if(err){
            return res.status(500).send({message: "database error",error:err});
        }
        if(!news){            
            return res.status(500).send({message: "news not found"});            
        }
        news.title=req.body.title
        news.news_body=req.body.newsbody
        news.save(function(err,news){
            if(err){
                return res.status(500).send({message: "database error",error:err});
            }
            return res.status(200).send({message: "news updated",updatednews:news});
        });
    });
}
exports.users_delete_news=async (req,res)=>{
    try{
    News.findOne({ _id: req.query.newsid }).remove(function(err){
        if(err){
            return res.status(500).send({message: "database error",error:err});
        }
        return res.status(200).send({message: "news deleted"});
    });   
    }catch(err){
        return res.status(500).send({message: "database error",error:err});
    }  
    
}
exports.users_view_news=async (req,res)=>{
    News.findOne({ _id: req.query.newsid },function(err,news){
        if(err){
            return res.status(500).send({message: "database error",error:err});
        }
        if(!news){
            return res.status(500).send({message: "news not found"}); 
        }
        return res.status(200).send({news:news});
    });   
    
}
exports.users_view_newslist=async (req,res)=>{
    let skipvalue=0
    let newslimit=10    
    if(req.query.pageNumber!==undefined && (parseInt(req.query.pageNumber)-1)>=0 && req.query.numberOfNews!==undefined && parseInt(req.query.numberOfNews)>=0){
        skipvalue=parseInt(req.query.numberOfNews)*(parseInt(req.query.pageNumber)-1);
    }else if(req.query.pageNumber!==undefined && (parseInt(req.query.pageNumber)-1)>=0){
        skipvalue=(parseInt(req.query.pageNumber)-1)*newslimit;
    }    
    if(req.query.numberOfNews!==undefined && parseInt(req.query.numberOfNews)>=0){
        newslimit=parseInt(req.query.numberOfNews)
    }
    News.find().sort({ 'updatedAt': 'desc' }).skip(skipvalue).limit(newslimit).exec(function(err,news){
        if(err){
            return res.status(500).send({message: "database error",error:err});
        }
        return res.status(200).send({news:news});
    });   
    
}
