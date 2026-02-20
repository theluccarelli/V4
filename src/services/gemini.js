const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

export const callGemini = async (prompt, systemInstruction) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("⚠️ API Key não configurada.");
        return "⚠️ Configuração necessária: Crie um arquivo .env na raiz do projeto e adicione VITE_GEMINI_API_KEY=sua_chave_aqui";
    }

    const url = `${API_URL}?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível obter resposta da IA.";
    } catch (e) {
        console.error("Erro na API:", e);
        return "Erro na conexão inteligente. Verifique o console para mais detalhes.";
    }
};
