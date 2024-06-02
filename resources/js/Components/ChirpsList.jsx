import React from "react";
import Chirp from "@/Components/Chirp";

export default function ChirpsList({chirps, onChirpEdit, onChirpDelete}) {
    return (
        <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
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
}
