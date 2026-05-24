import json
from groq import Groq
from django.conf import settings


def analyze_fit(job_description: str, cv_text: str) -> dict:
    client = Groq(api_key=settings.GROQ_API_KEY)

    prompt = f"""Eres un experto en recursos humanos y reclutamiento técnico. Analiza qué tan bien encaja este CV con la oferta de trabajo.

OFERTA DE TRABAJO:
{job_description}

CV DEL CANDIDATO:
{cv_text}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin texto adicional):
{{
  "score": <número del 0 al 100>,
  "resumen": "<2-3 oraciones evaluando el perfil en general>",
  "habilidades_encontradas": ["<habilidad1>", "<habilidad2>", ...],
  "habilidades_faltantes": ["<habilidad1>", "<habilidad2>", ...],
  "fortalezas": ["<fortaleza1>", "<fortaleza2>", "<fortaleza3>"],
  "recomendaciones": ["<recomendacion1>", "<recomendacion2>", "<recomendacion3>", "<recomendacion4>"]
}}

El score debe reflejar objetivamente qué tan bien cumple el candidato los requisitos de la oferta."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()

    # Extraer JSON aunque venga con texto alrededor
    start = raw.find('{')
    end = raw.rfind('}') + 1
    return json.loads(raw[start:end])
