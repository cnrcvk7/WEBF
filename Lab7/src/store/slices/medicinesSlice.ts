import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Medicine, T_MedicinesFilters, T_Substance} from "modules/types.ts";
import {NEXT_MONTH, PREV_MONTH} from "modules/consts.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";

type T_MedicinesSlice = {
    draft_medicine_id: number | null,
    substances_count: number | null,
    medicine: T_Medicine | null,
    medicines: T_Medicine[],
    filters: T_MedicinesFilters,
    save_mm: boolean
}

const initialState:T_MedicinesSlice = {
    draft_medicine_id: null,
    substances_count: null,
    medicine: null,
    medicines: [],
    filters: {
        status: 0,
        date_formation_start: PREV_MONTH.toISOString().split('T')[0],
        date_formation_end: NEXT_MONTH.toISOString().split('T')[0]
    },
    save_mm: false
}

export const fetchMedicine = createAsyncThunk<T_Medicine, string, AsyncThunkConfig>(
    "medicines/medicine",
    async function(medicine_id) {
        const response = await api.medicines.medicinesRead(medicine_id) as AxiosResponse<T_Medicine>
        return response.data
    }
)

export const fetchMedicines = createAsyncThunk<T_Medicine[], object, AsyncThunkConfig>(
    "medicines/medicines",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.medicines.medicinesList({
            status: state.medicines.filters.status,
            date_formation_start: state.medicines.filters.date_formation_start,
            date_formation_end: state.medicines.filters.date_formation_end
        }) as AxiosResponse<T_Medicine[]>
        return response.data
    }
)

export const removeSubstanceFromDraftMedicine = createAsyncThunk<T_Substance[], string, AsyncThunkConfig>(
    "medicines/remove_substance",
    async function(substance_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.medicines.medicinesDeleteSubstanceDelete(state.medicines.medicine.id, substance_id) as AxiosResponse<T_Substance[]>
        return response.data
    }
)

export const deleteDraftMedicine = createAsyncThunk<void, object, AsyncThunkConfig>(
    "medicines/delete_draft_medicine",
    async function(_, {getState}) {
        const state = getState()
        await api.medicines.medicinesDeleteDelete(state.medicines.medicine.id)
    }
)

export const sendDraftMedicine = createAsyncThunk<void, object, AsyncThunkConfig>(
    "medicines/send_draft_medicine",
    async function(_, {getState}) {
        const state = getState()
        await api.medicines.medicinesUpdateStatusUserUpdate(state.medicines.medicine.id)
    }
)

export const updateMedicine = createAsyncThunk<void, object, AsyncThunkConfig>(
    "medicines/update_medicine",
    async function(data, {getState}) {
        const state = getState()
        await api.medicines.medicinesUpdateUpdate(state.medicines.medicine.id, {
            ...data
        })
    }
)

export const updateSubstanceValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "medicines/update_mm_value",
    async function({substance_id, weight},thunkAPI) {
        const state = thunkAPI.getState()
        await api.medicines.medicinesUpdateSubstanceUpdate(state.medicines.medicine.id, substance_id, {weight})
    }
)

const medicinesSlice = createSlice({
    name: 'medicines',
    initialState: initialState,
    reducers: {
        saveMedicine: (state, action) => {
            state.draft_medicine_id = action.payload.draft_medicine_id
            state.substances_count = action.payload.substances_count
        },
        removeMedicine: (state) => {
            state.medicine = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMedicine.fulfilled, (state:T_MedicinesSlice, action: PayloadAction<T_Medicine>) => {
            state.medicine = action.payload
        });
        builder.addCase(fetchMedicines.fulfilled, (state:T_MedicinesSlice, action: PayloadAction<T_Medicine[]>) => {
            state.medicines = action.payload
        });
        builder.addCase(removeSubstanceFromDraftMedicine.rejected, (state:T_MedicinesSlice) => {
            state.medicine = null
        });
        builder.addCase(removeSubstanceFromDraftMedicine.fulfilled, (state:T_MedicinesSlice, action: PayloadAction<T_Substance[]>) => {
            if (state.medicine) {
                state.medicine.substances = action.payload as T_Substance[]
            }
        });
        builder.addCase(sendDraftMedicine.fulfilled, (state:T_MedicinesSlice) => {
            state.medicine = null
        });
    }
})

export const { saveMedicine, removeMedicine, triggerUpdateMM, updateFilters } = medicinesSlice.actions;

export default medicinesSlice.reducer