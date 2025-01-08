import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import medicinesReducer from "./slices/medicinesSlice.ts"
import substancesReducer from "./slices/substancesSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        medicines: medicinesReducer,
        substances: substancesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;