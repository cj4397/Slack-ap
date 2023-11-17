import React from 'react'
import { getDatabase, set, ref } from 'firebase/database'

export default function Database() {
    const db: any = getDatabase()
    // const reference=ref(db, 'users/'+ userId)
    return {
        db
    }
}
