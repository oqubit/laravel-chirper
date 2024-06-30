import React, { forwardRef } from "react";
import Chirp from "@/Components/Chirp";

const ChirpsList = forwardRef(({ chirps, onChirpEdit, onChirpDelete }, ref) => {
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

export default ChirpsList;