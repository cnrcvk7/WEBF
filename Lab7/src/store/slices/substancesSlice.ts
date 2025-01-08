import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Substance, T_SubstancesListResponse} from "modules/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";
import {saveMedicine} from "store/slices/medicinesSlice.ts";

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
    }
})

export const { updateSubstanceName, removeSelectedSubstance} = substancesSlice.actions;

export default substancesSlice.reducer