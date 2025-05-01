import httpx
from django.conf import settings


async def ask_gemini(message: str) -> str:
    payload = {
        "contents": [{"parts": [{"text": message}]}]
    }
    url = f"{settings.GEMINI_API_URL}?key={settings.GEMINI_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            print("Sending request to Gemini...")
            response = await client.post(
                url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
    except httpx.RequestError as e:
        print("Network error:", e)
        return f"Error: Failed to connect to Gemini API. {e}"

    try:
        data = response.json()
    except Exception as e:
        print("Failed to parse response JSON:", e)
        return "Error: Invalid response from Gemini."

    if response.status_code != 200:
        print("Gemini API returned error:", data)
        return f"Error: Gemini API failed. {data.get('error', {}).get('message', 'Unknown error')}"

    try:
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print("Gemini parsing error:", e)
        return "Error: Unexpected Gemini response format."

