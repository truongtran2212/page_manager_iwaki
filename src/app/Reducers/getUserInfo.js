import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const initialState ={
//   status:'idle',
//   userInfo:{},
//   timeSystem:null,
//   error:null,
// }

// export const getUserInfo = createAsyncThunk(
//   async({rejectWithValue}) =>{
//     try{
//       const reponse = await
//     }
//   }
// )

const userSlice = createSlice({
  name: "user",
  initialState: {
    user_id: "1",
    user_msnv: "RS42005",
    user_fullname: "Phan Đình Phùng",
    user_role: "1",
    user_role_title: "APP_USER",
    is_active: "0",
  },
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return {
        user_id: "1",
        user_msnv: "RS42005",
        user_fullname: "Phan Đình Phùng",
        user_role: "1",
        user_role_title: "APP_USER",
        is_active: "0",
      };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
