from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
import os

class GoogleChatAPIView(APIView):
    def post(self, request):
        user_message = request.data.get("message", "")
        if not user_message:
            return Response({"reply": "Bạn vui lòng nhập câu hỏi."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            print("GOOGLE_API_KEY:", api_key)
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(user_message)
            reply = response.text
            return Response({"reply": reply})
        except Exception as e:
            return Response({"reply": "Xin lỗi, hệ thống AI đang bận hoặc có lỗi."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)