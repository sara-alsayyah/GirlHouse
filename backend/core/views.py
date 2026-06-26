from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView

from .models import City, ContactMessage
from .serializers import CitySerializer, ContactSerializer


class ContactAPIView(APIView):

    authentication_classes = []  
    permission_classes = []      

    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Invalid input",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        contact = serializer.save()

        return Response(
            {
                "status": "success",
                "message": "Message sent successfully",
                "data": {
                    "id": contact.id,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class CityListAPIView(ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        return City.objects.filter(is_active=True).order_by("name")
