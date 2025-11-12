const { createSlice } = require("@reduxjs/toolkit");
const { reset } = require("../authReducer");
const { getAllPosts } = require("../../action/postAction");

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
        state.postId = ""
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true,
            state.message = "Fetching all the posts..."
        })
  }
});
