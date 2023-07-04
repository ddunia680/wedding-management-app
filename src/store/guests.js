import { createSlice } from "@reduxjs/toolkit";

const guestsSlice = createSlice({
    name: 'guests',
    initialState: {
        guests: []
    }, 
    reducers: {
        ADDAGUEST: (state, action) => {
            state.guests.push(action.payload);
        },

        PULLEDGUESTSAVE: (state, action) => {
            state.guests = action.payload;
        }
    }
});

export const { ADDAGUEST, PULLEDGUESTSAVE } = guestsSlice.actions;
export default guestsSlice.reducer;