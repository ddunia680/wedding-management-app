import { configureStore } from "@reduxjs/toolkit";
import authenticate from "./authenticate";
import guests from "./guests";

const store = configureStore({
    reducer: {
        authenticate: authenticate,
        guests: guests
    }
});

export default store;