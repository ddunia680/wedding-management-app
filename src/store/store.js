import { configureStore } from "@reduxjs/toolkit";
import authenticate from "./authenticate";
import guests from "./guests";
import notifHandler from "./notifHandler";

const store = configureStore({
    reducer: {
        authenticate: authenticate,
        guests: guests,
        notifHandler: notifHandler
    }
});

export default store;