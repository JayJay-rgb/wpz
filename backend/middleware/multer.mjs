import multer from "multer"

const storage= multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads")
    },

    filename:(req,file,callback)=>{
        callback(null,Date.now()+file.originalname)
    }
})

export const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3
    }
})