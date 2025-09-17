import { createSlice } from "@reduxjs/toolkit";
import { updateLearnerProfile } from "../services/learnerServices";
import { logout } from "../services/userAuthServices";

interface ILearnerState {
    id: string | null;
    name: string | null;
    email: string | null;
    walletBalance: number | null;
    profilePic: string |null;

}

const initialState: ILearnerState = {
    id: null,
    name: null,
    email: null,
    walletBalance: null,
    profilePic:null
}


const learnerSlice = createSlice({
    name: 'learner',
    initialState,
    reducers: {
        setLearner: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.walletBalance = action.payload.walletBalance;
            state.profilePic = action.payload.profilePic;
        },

        clearLearner: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateLearnerProfile.fulfilled, (state, action) => {
                console.log(action.payload);
                state.name = action.payload.name;
                state.profilePic = action.payload.imageURL;

            })
            .addCase(logout.fulfilled, (state, action) => {
                console.log(action.payload);
                state.id = null;
                state.name = null;
                state.email = null;
                state.walletBalance = null;
                state.profilePic=null
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.name = null;
                state.email = null;
                state.walletBalance = null;
                state.profilePic=null
            })
    }
});


export const { setLearner, clearLearner } = learnerSlice.actions;
export default learnerSlice.reducer;