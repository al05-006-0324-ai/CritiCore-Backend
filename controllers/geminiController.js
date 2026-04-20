const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarFeedback = async (req, res) => {
    const { tituloCaso, descripcionCaso, justificacionAlumno, esCorrecto, explicacionOriginal } = req.body;

    if (!tituloCaso || !justificacionAlumno) {
        return res.status(400).json({ error: 'Faltan datos necesarios.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
Eres un tutor amigable de pensamiento crítico para niños de primaria (8 a 12 años). 
Un alumno ha respondido a un caso educativo. Debes darle una retroalimentación muy cariñosa, motivadora y fácil de entender. 
Usa un lenguaje cálido, ejemplos concretos y evita tecnicismos. Sé breve (máximo 4 oraciones).

Información del caso:
Título: ${tituloCaso}
Descripción: ${descripcionCaso}

Lo que escribió el alumno (su justificación):
"${justificacionAlumno}"

La respuesta del alumno fue: ${esCorrecto ? "CORRECTA" : "INCORRECTA"}

Si la respuesta es correcta, felicítalo y explica por qué su razonamiento va por buen camino.
Si es incorrecta, no lo regañes. Anímalo a pensar de otra manera y dale una pista amable basada en la siguiente explicación real (pero reescríbela de forma sencilla):
"${explicacionOriginal}"

Ahora, escribe tu mensaje de retroalimentación para el alumno (máximo 100 palabras).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text();

        res.json({ feedback: feedback.trim() });
    } catch (error) {
        console.error('Error al llamar a Gemini:', error);
        // Fallback: devolver la explicación original si falla la IA
        res.json({ feedback: explicacionOriginal || "¡Sigue practicando! Cada día aprendes más." });
    }
};

module.exports = { generarFeedback };