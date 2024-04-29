const mongoose= require("mongoose")
const schema= mongoose.Schema

const userSchema= new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
}
)

const userModel= new mongoose.model("userdata",userSchema)
module.exports= userModel