export type T_Substance = {
    id: string
    name: string
    description: string
    number: number
    image: string
    status: number
    weight?: string
}

export type T_Medicine = {
    id: string | null
    status: E_MedicineStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    substances: T_Substance[]
    name: string
    description: string
    dose: string
}

export enum E_MedicineStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
}

export type T_MedicinesFilters = {
    date_formation_start: string
    date_formation_end: string
    status: number
}

export type T_SubstancesListResponse = {
    substances: T_Substance[],
    draft_medicine_id: number,
    substances_count: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}