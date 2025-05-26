import mongoose from "mongoose";

const dbConnect = async()=>{
    try{

       await mongoose.connect(process.env.MONGO_URI);;
       console.log("database connected successfully");
    }catch(err){
        console.log(err)
    }
}

export default dbConnect;