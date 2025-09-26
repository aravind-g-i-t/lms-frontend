import { createSlice } from "@reduxjs/toolkit";
import { getLearnerProfile, updateLearnerProfile } from "../services/learnerServices";
import { logout } from "../services/userAuthServices";

interface ILearnerState {
    id: string | null;
    name: string | null;
    profilePic: string | null;

}

const initialState: ILearnerState = {
    id: null,
    name: null,
    profilePic: null
}

const learnerSlice = createSlice({
    name: 'learner',
    initialState,
    reducers: {
        setLearner: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profilePic = action.payload.profilePic;
        },

        setLearnerName: (state, action) => {
            state.name = action.payload.name;
        },
        setLearnerImage: (state, action) => {
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
            .addCase(getLearnerProfile.fulfilled, (state, action) => {
                console.log(action.payload);
                state.name = action.payload.learner.name;
                state.profilePic = action.payload.learner.profilePic;

            })
            .addCase(logout.fulfilled, (state, action) => {
                console.log(action.payload);
                state.id = null;
                state.name = null;
                state.profilePic = null
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.name = null;
                state.profilePic = null
            })
    }
});


export const { setLearner, clearLearner,setLearnerImage,setLearnerName } = learnerSlice.actions;
export default learnerSlice.reducer;