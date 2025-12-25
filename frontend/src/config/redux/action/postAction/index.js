import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => {
        try {
            const response = await clientServer.get('/posts');

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData, thunkAPI) => {
        const { file, body } = userData;

        try {
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'));
            formData.append('body', body);
            formData.append('media', file);

            const response = await clientServer.post("/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Uploaded");
            } else {
                return thunkAPI.rejectWithValue("Post not uploaded");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(postData, thunkAPI) => {
        try {
            const response = await clientServer.post("/delete_post", {
                token: localStorage.getItem('token'),
                post_id: postData.post_id
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(postData.post_id);
            } else {
                return thunkAPI.rejectWithValue("Post not deleted");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete post");
        }
    }
)

export const incrementLike = createAsyncThunk(
    "post/incrementLike",
    async(postData, thunkAPI) => {
        try {
            const response = await clientServer.post("/increment_post_like", {
                token: localStorage.getItem('token'),
                post_id: postData.post_id
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(postData.post_id);
            } else {
                return thunkAPI.rejectWithValue("Post not liked");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to like post");
        }
    }
)

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data.comments,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem('token'),
        post_id: postData.post_id,
        commentBody: postData.body,
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue(postData.post_id);
      } else {
        return thunkAPI.rejectWithValue("Comment not created");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to create comment");
    }
  }
);