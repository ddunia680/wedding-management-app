import { createSlice } from "@reduxjs/toolkit";

const guestsSlice = createSlice({
    name: 'guests',
    initialState: {
        guests: []
    }, 
    reducers: {
        ADDAGUEST: (state, action) => {
            state.guests.push(action.payload);
            state.guests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },

        PULLEDGUESTSAVE: (state, action) => {
            state.guests = action.payload;
            state.guests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
        },
        DELETEGUEST: (state, action) => {
            const theGuestIndex = state.guests.findIndex(g => g._id === action.payload); 
            state.guests.splice(theGuestIndex, 1);
        }
    }
});

export const { ADDAGUEST, PULLEDGUESTSAVE, DELETEGUEST } = guestsSlice.actions;
export default guestsSlice.reducer;