'use client'
import React, { useState } from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI'

export default function CreateGroup(props: {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    modal: boolean
}) {
    const { setModal, modal } = props
    const { createGroup } = FirebaseAPI()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await createGroup(e.target.Group.value)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className={`${modal && 'is-active'} modal`}>
            <div className="modal-background"></div>
            <div className="modal-card h-100">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button onClick={() => setModal(false)} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body ">

                    <form onSubmit={handleSubmit}>
                        <input name='Group' type="text" />
                    </form>

                </section>
                <footer className="modal-card-foot">
                    <button onClick={() => setModal(false)} className="button">Finish</button>
                </footer>
            </div>
        </div>
    )
}
