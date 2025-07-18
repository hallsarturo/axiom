'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const UserProfileContext = createContext()

export const UserProfileProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async()
    })
}