from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator


class CustomerGeneratorSchema(OpenAPISchemaGenerator):
    def get_operation(self, *args, **kwargs):
        operation = super().get_operation(*args, **kwargs)
        organization_header = openapi.Parameter(
            name="organization",
            description="Description",
            required=False,
            in_=openapi.IN_HEADER,
            type=openapi.TYPE_STRING,
            default="",
        )
        operation.parameters.append(organization_header)
        return operation
