import json
from audit.models import AdminActionLog
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class AuditMiddleware:
   

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        try:
            user = getattr(request, "user", None)

            # only log authenticated admin actions
            if user and user.is_authenticated and user.is_staff:

                path = request.path
                method = request.method

                # ignore noise
                if any(x in path for x in ["/static", "/media", "/admin/js"]):
                    return response

                action_type = "system_action"

                if "admin" in path:
                    action_type = "admin_action"

                message = f"{method} {path}"

                if method in ["POST", "PUT", "PATCH"]:
                    try:
                        body = request.body.decode("utf-8")[:500]
                        message += f" | body: {body}"
                    except Exception:
                        pass

                AdminActionLog.objects.create(
                    admin=user,
                    action_type=action_type,
                    message=message
                )

        except Exception:
           
            pass

        return response