import { configureStore } from "@reduxjs/toolkit";
import thuChiReducer from "../reducers/thuChiReducer";

export default configureStore({
    reducer: {
        listThuChi: thuChiReducer
    }
});