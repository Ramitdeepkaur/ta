import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
   
       type:String,
       required:true  
        },
        publishYear: {
            type: Number,
            required: true,
        },
        price:{
            type:Number,
            required:true,
        },
        copies: {  
            type: Number,
            required: true,
        },
        sold:{
            type:Number,
            required:true,
            default:0,
        },
        // description: {  
        //     type: String,
        //     required: true,
        //     minlength: 20, 
        //   },
    },
    {
        timestamps: true,
    }
)

export const Book = mongoose.model('Book', bookSchema);