import {createSlice} from "@reduxjs/toolkit";

type T_SubstancesSlice = {
    substance_name: string
}

const initialState:T_SubstancesSlice = {
    substance_name: "",
}


const substancesSlice = createSlice({
    name: 'substances',
    initialState: initialState,
    reducers: {
        updateSubstanceName: (state, action) => {
            state.substance_name = action.payload
        }
    }
})

export const { updateSubstanceName} = substancesSlice.actions;

export default substancesSlice.reducer