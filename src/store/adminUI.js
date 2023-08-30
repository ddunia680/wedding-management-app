import { createSlice } from "@reduxjs/toolkit";

const AdminUISlice = createSlice({
    name: 'AdminUIControl',
    initialState: {
        showInviteSendPopup: false,
    },
    reducers: {
        SHOWINVITEPOPUP: (state, action) => {
            state.showInviteSendPopup = true;
        },

        HIDEINVITEPOPUP: (state, action) => {
            state.showInviteSendPopup = false;
        }
    }
});
export const { SHOWINVITEPOPUP, HIDEINVITEPOPUP } = AdminUISlice.actions;
export default AdminUISlice.reducer;