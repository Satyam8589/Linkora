import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        typr: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    body: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;