import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    embryoBankDetails: {},
    embryoBankLoading: false,
    embryoBankUpdate: false,
};

export const getEmbryoBankData = createAsyncThunk(
    "get-embryoBank-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .get(
                    `embryo_bank/view/${module_id}/${location_id}/${patient_reg_id}`
                )
                .then((res) => {
                    if (res?.data?.err === 0) {
                        if (Object.keys(res?.data?.data).length > 0) {
                            resolve(res.data?.data);
                        } else {
                            resolve({});
                        }
                    } else {
                        reject({});
                    }
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.msg);
                    reject(error);
                });
        });
    }
);

export const addEmbryoBankData = createAsyncThunk(
    "add-embryoBank-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload } = props;
            axios
                .post(
                    `embryo_bank/vitrification/add-detail/${module_id}/${location_id}/${patient_reg_id}`,
                    payload
                )
                .then((res) => {
                    if (res?.data?.err === 0) {
                        toast.success(res.data?.msg);
                        resolve(res?.data?.data);
                    } else {
                        toast.error(res?.data?.msg);
                        reject({ message: res?.data?.msg });
                    }
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.msg);
                    reject(error);
                });
        });
    }
);

export const embryoBankDataSlice = createSlice({
    name: "embryo-bank-data",
    initialState,
    reducers: {
        setEmbryoBankDataUpdate: (state, action) => {
            state.embryoBankUpdate = action.payload;
        },
        setEmbryoBankDetailsData: (state, action) => {
            state.embryoBankDetails = action.payload;
        },
    },
    extraReducers: {

        [getEmbryoBankData.pending]: (state) => {
            state.embryoBankDetails = {};
            state.embryoBankLoading = true;
        },
        [getEmbryoBankData.rejected]: (state) => {
            state.embryoBankDetails = {};
            state.embryoBankLoading = false;
        },
        [getEmbryoBankData.fulfilled]: (state, action) => {
            state.embryoBankDetails = action.payload;
            state.embryoBankLoading = false;
        },
        [addEmbryoBankData.pending]: (state) => {
            state.embryoBankLoading = true;
            state.embryoBankDetails = {};
            state.embryoBankUpdate = false;
        },
        [addEmbryoBankData.rejected]: (state) => {
            state.embryoBankLoading = false;
            state.embryoBankDetails = {};
            state.embryoBankUpdate = false;
        },
        [addEmbryoBankData.fulfilled]: (state, action) => {
            state.embryoBankLoading = false;
            state.embryoBankUpdate = true;
            state.embryoBankDetails = action.payload;
        },
    },
});
export const { setEmbryoBankDataUpdate, setEmbryoBankDetailsData } =
    embryoBankDataSlice.actions;
export default embryoBankDataSlice.reducer;