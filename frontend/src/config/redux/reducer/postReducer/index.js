const { createSlice } = require("@reduxjs/toolkit");
const { reset } = require("../authReducer");
import { getAllPosts, deletePost, incrementLike, getAllComments } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        (state.isLoading = true), 
        (state.message = "Fetching all the posts...");
        console.log("Fetching posts...");
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts;
        console.log("Posts fetched successfully:", action.payload.posts);
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.error("Error fetching posts:", action.payload);
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.message = "Deleting post...";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        // Remove the deleted post from the posts array
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.message = "Post deleted successfully";
        console.log("Post deleted:", action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.error("Error deleting post:", action.payload);
      })
      .addCase(incrementLike.pending, (state) => {
        state.message = "Liking post...";
      })
      .addCase(incrementLike.fulfilled, (state, action) => {
        state.isError = false;
        state.message = "Post liked successfully";
        // Find the post and increment its like count
        const post = state.posts.find(p => p._id === action.payload);
        if (post) {
          post.likes = (post.likes || 0) + 1;
        }
        console.log("Post liked:", action.payload);
      })
      .addCase(incrementLike.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        console.error("Error liking post:", action.payload);
      })
      .addCase(getAllComments.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching comments...";
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.comments = action.payload.comments;
        state.postId = action.payload.post_id;
        console.log("Comments fetched successfully:", action.payload.comments);
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.error("Error fetching comments:", action.payload);
      });
  },
});

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;