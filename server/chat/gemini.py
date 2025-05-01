import httpx
from django.conf import settings


async def ask_gemini(message: str) -> str:
    payload = {
        "contents": [{"parts": [{"text": message}]}]
    }
    url =  f"{settings.GEMINI_API_URL}?key={settings.GEMINI_API_KEY}"
    print(url)
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            json=payload,
            # headers={"Content-Type": "application/json"}
        )
    data = response.json()
    print(data)
    try:
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"Something went wrong with Gemini response.{e}"
