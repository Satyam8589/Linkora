const { createSlice } = require("@reduxjs/toolkit");
const { reset } = require("../authReducer");
import { getAllPosts, deletePost } from "../../action/postAction";

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
      });
  },
});

export default postSlice.reducer;