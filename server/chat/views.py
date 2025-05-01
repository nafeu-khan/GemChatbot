from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MessageSerializer
from .gemini import ask_gemini
import asyncio

class ChatbotView(APIView):
    def post(self, request):
        try:
            print("Received request:", request.data)
            serializer = MessageSerializer(data=request.data)
            if serializer.is_valid():
                user_msg = serializer.validated_data['message']
                bot_reply = asyncio.run(ask_gemini(user_msg))
                return Response({"reply": bot_reply})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
