import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../services/userAuthServices";
import { getInstructorProfile } from "../services/instructorServices";

interface IInstructorState {
    id: string | null;
    name: string | null;
    profilePic: string | null;

}

const initialState: IInstructorState = {
    id: null,
    name: null,
    profilePic: null,

}


const instructorSlice = createSlice({
    name: 'instructor',
    initialState,
    reducers: {
        setInstructor: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profilePic = action.payload.profilePic;
        },
        setInstructorName: (state, action) => {
            state.name = action.payload.name;
        },
        setInstructorImage: (state, action) => {
            state.profilePic = action.payload.profilePic;
        },

        clearInstructor: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state, action) => {
                console.log(action.payload);
                state.id = null;
                state.name = null;
                state.profilePic = null
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(getInstructorProfile.fulfilled, (state, action) => {
                console.log(action.payload);
                state.name = action.payload.instructor.name;
                state.profilePic = action.payload.instructor.profilePic;

            })
    }
});


export const { setInstructor, clearInstructor ,setInstructorName,setInstructorImage} = instructorSlice.actions;
export default instructorSlice.reducer;