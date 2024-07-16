import { createSlice } from "@reduxjs/toolkit";

// 1. Khai báo khởi tạo state
const initialState = {
    listThuChi : [] // chứa danh sách thu chi
}

// 2. Thiết lập cho reducer và định nghĩa các action
const thuChiSlice = createSlice({
    name : 'thuchi',
    initialState,
    reducers: {
        addThuChi (state, action) {
            state.listThuChi.push(action.payload);
        },
        deleteThuChi(state, action) {
            state.listThuChi = state.listThuChi.filter(row=>row.id!==action.payload)
        }, 
        updateThuChi(state, action) {
            const {id, tieuDe, moTa, ngay, loai, soTien} = action.payload;
            const thuchi = state.listThuChi.find(row => row.id == id)
            if(thuchi) {
                thuchi.tieuDe = tieuDe
                thuchi.moTa = moTa
                thuchi.ngay = ngay
                thuchi.loai = loai
                thuchi.soTien = soTien
            }
        }
    }
})

export const {addThuChi, deleteThuChi, updateThuChi} = thuChiSlice.actions;
export default thuChiSlice.reducer;