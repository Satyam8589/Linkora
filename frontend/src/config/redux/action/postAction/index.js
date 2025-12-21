import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => {
        try {
            const response = await clientServer.post('/posts');

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
 )