import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'error component',
    initialState: {
        aNotification: false,
        notifMessage: '',
        isError: true,
    },
    reducers: {
        ADDANOTIFICATION: (state, action) => {
            state.aNotification = action.payload.notif;
            state.isError = action.payload.isError;
            state.notifMessage = action.payload.notifMessage;
        },
        HIDENOTIFVIEW: (state, action) => {
            state.aNotification = false;
            state.isError = false;
            state.notifMessage = '';            
        }
    }
})

export const { ADDANOTIFICATION, HIDENOTIFVIEW } = notificationSlice.actions;
export default notificationSlice.reducer;