from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.

    if not hasattr(exc, "detail"):
        exc.detail = "error"

    if not isinstance(exc.detail, str):
        exc.detail = {"detail": exc.detail}

    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data["status_code"] = response.status_code
        response.data["code"] = (
            exc.default_code if hasattr(exc, "default_code") else "error"
        )

    return response
