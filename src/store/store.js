import { configureStore } from "@reduxjs/toolkit";
import authenticate from "./authenticate";
import guests from "./guests";
import notifHandler from "./notifHandler";
import adminUI from "./adminUI";

const store = configureStore({
    reducer: {
        authenticate: authenticate,
        guests: guests,
        notifHandler: notifHandler,
        adminUI: adminUI
    }
});

export default store;