let mediaRecorder;
let audioChunks = [];
let audioBlobUrl = null; // Para el botón de descarga

// ✅ Botón "Reproducir y Grabar"
async function leerYGrabar() {
    const texto = document.getElementById("texto").value;
    if (!texto.trim()) {
        alert("Escribe algo primero.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';

    speechSynthesis.speak(utterance);
}

// ✅ Botón "Generar WAV" usando OpenAI
async function generarWAV() {
    const texto = document.getElementById("texto").value.trim();
    const descargarBtn = document.getElementById("descargarBtn");

    if (!texto) {
        alert("Escribe algo primero.");
        return;
    }

    descargarBtn.style.display = "none";

    try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                "Authorization": "Bearer", // 🔁 Pega tu API Key real aquí
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "tts-1",
                voice: "alloy", // Puedes usar: alloy, echo, fable, nova, shimmer
                input: texto,
                response_format: "wav"
            })
        });

        if (!response.ok) {
            throw new Error(`Error al generar WAV: ${response.status}`);
        }

        const audioData = await response.arrayBuffer();
        const blob = new Blob([audioData], { type: "audio/wav" });
        audioBlobUrl = URL.createObjectURL(blob);

        // Mostrar reproductor y botón de descarga
        const audio = document.getElementById("audio");
        audio.src = audioBlobUrl;
        audio.style.display = 'block';

        descargarBtn.style.display = 'inline-block';

    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
    }
}

// ✅ Botón "Descargar WAV"
function descargarWAV() {
    if (!audioBlobUrl) {
        alert("Primero debes generar el archivo WAV.");
        return;
    }

    const a = document.createElement("a");
    a.href = audioBlobUrl;
    a.download = "voz.wav";
    a.click();
}