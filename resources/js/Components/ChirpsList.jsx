import React, { forwardRef } from "react";
import Chirp from "@/Components/Chirp";

export default forwardRef(function ChirpsList({ chirps, onChirpEdit, onChirpDelete }, ref) {
    return (
        <div ref={ref} className="mt-6 bg-white shadow-sm rounded-lg divide-y">
            {chirps.data.map((chirp) => (
                <Chirp
                    key={chirp.id}
                    chirp={chirp}
                    onChirpEdit={onChirpEdit}
                    onChirpDelete={onChirpDelete}
                />
            ))}
        </div>
    );
});