from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .cart_service import CartService
from .serializers import CartItemSerializer


def parse_positive_int(value, field_name):
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return None, {"error": f"{field_name} must be a positive integer"}

    if parsed <= 0:
        return None, {"error": f"{field_name} must be a positive integer"}

    return parsed, None


class AddToCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id, product_error = parse_positive_int(
            request.data.get("product_id"),
            "product_id"
        )
        if product_error:
            return Response(product_error, status=400)

        quantity, quantity_error = parse_positive_int(
            request.data.get("quantity", 1),
            "quantity"
        )
        if quantity_error:
            return Response(quantity_error, status=400)

        result = CartService.add_to_cart(
            user=request.user,
            product_id=product_id,
            quantity=quantity,
        )

        if "error" in result:
            return Response(result, status=400)

        return Response({"message": "Item added to cart"})


class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CartService.get_cart(request.user)
        return Response(CartItemSerializer(items, many=True).data)


class UpdateCartItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        quantity, quantity_error = parse_positive_int(
            request.data.get("quantity"),
            "quantity"
        )
        if quantity_error:
            return Response(quantity_error, status=400)

        result = CartService.update_item(
            user=request.user,
            item_id=item_id,
            quantity=quantity,
        )

        if "error" in result:
            return Response(result, status=400)

        return Response({"message": "Cart updated"})


class RemoveCartItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        result = CartService.remove_item(
            user=request.user,
            item_id=item_id,
        )

        if "error" in result:
            return Response(result, status=400)

        return Response({"message": "Item removed"})
