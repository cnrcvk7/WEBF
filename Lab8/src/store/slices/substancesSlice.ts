import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Substance, T_SubstanceAddData, T_SubstancesListResponse} from "modules/types.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {saveMedicine} from "store/slices/medicinesSlice.ts";
import {Substance} from "src/api/Api.ts";

type T_SubstancesSlice = {
    substance_name: string
    substance: null | T_Substance
    substances: T_Substance[]
}

const initialState:T_SubstancesSlice = {
    substance_name: "",
    substance: null,
    substances: []
}

export const fetchSubstance = createAsyncThunk<T_Substance, string, AsyncThunkConfig>(
    "fetch_substance",
    async function(id) {
        const response = await api.substances.substancesRead(id) as AxiosResponse<T_Substance>
        return response.data
    }
)

export const fetchSubstances = createAsyncThunk<T_Substance[], object, AsyncThunkConfig>(
    "fetch_substances",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.substances.substancesList({
            substance_name: state.substances.substance_name
        }) as AxiosResponse<T_SubstancesListResponse>

        thunkAPI.dispatch(saveMedicine({
            draft_medicine_id: response.data.draft_medicine_id,
            substances_count: response.data.substances_count
        }))

        return response.data.substances
    }
)

export const addSubstanceToMedicine = createAsyncThunk<void, string, AsyncThunkConfig>(
    "substances/add_substance_to_medicine",
    async function(substance_id) {
        await api.substances.substancesAddToMedicineCreate(substance_id)
    }
)

export const deleteSubstance = createAsyncThunk<T_Substance[], string, AsyncThunkConfig>(
    "delete_substance",
    async function(substance_id) {
        const response = await api.substances.substancesDeleteDelete(substance_id) as AxiosResponse<T_Substance[]>
        return response.data
    }
)

export const updateSubstance = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_substance",
    async function({substance_id, data}) {
        await api.substances.substancesUpdateUpdate(substance_id as string, data as Substance)
    }
)

export const updateSubstanceImage = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_substance_image",
    async function({substance_id, data}) {
        await api.substances.substancesUpdateImageCreate(substance_id as string, data as {image?: File})
    }
)

export const createSubstance = createAsyncThunk<void, T_SubstanceAddData, AsyncThunkConfig>(
    "update_substance",
    async function(data) {
        await api.substances.substancesCreateCreate(data)
    }
)

const substancesSlice = createSlice({
    name: 'substances',
    initialState: initialState,
    reducers: {
        updateSubstanceName: (state, action) => {
            state.substance_name = action.payload
        },
        removeSelectedSubstance: (state) => {
            state.substance = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSubstances.fulfilled, (state:T_SubstancesSlice, action: PayloadAction<T_Substance[]>) => {
            state.substances = action.payload
        });
        builder.addCase(fetchSubstance.fulfilled, (state:T_SubstancesSlice, action: PayloadAction<T_Substance>) => {
            state.substance = action.payload
        });
        builder.addCase(deleteSubstance.fulfilled, (state:T_SubstancesSlice, action: PayloadAction<T_Substance[]>) => {
            state.substances = action.payload
        });
    }
})

export const { updateSubstanceName, removeSelectedSubstance} = substancesSlice.actions;

export default substancesSlice.reducer