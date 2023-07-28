import json

import jinja2
import requests
from django.db import models

from selleraxis.services.models import Services


class ServiceAPIAction(models.TextChoices):
    ADDRESS_VALIDATION = "ADDRESS_VALIDATION"
    SHIPPING = "SHIPPING"
    CANCEL_SHIPPING = "CANCEL_SHIPMENT"
    LOGIN = "LOGIN"


class ServiceAPI(models.Model):
    action = models.CharField(max_length=255, choices=ServiceAPIAction.choices)
    sandbox_url = models.CharField(max_length=255)
    production_url = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    body = models.TextField()
    response = models.TextField()
    header = models.TextField(default="")
    service = models.ForeignKey(Services, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def request(self, data, is_sandbox=True):
        environment = jinja2.Environment()

        header_template = environment.from_string(self.header)
        body_template = environment.from_string(self.body)

        headers = json.loads(header_template.render(**data))
        if headers["Content-Type"] == "application/json":
            body = body_template.render(**data)
        else:
            body = json.loads(body_template.render(**data))

        res = requests.request(
            self.method,
            self.sandbox_url if is_sandbox else self.production_url,
            headers=headers,
            data=body,
        ).json()

        res_data = {}

        response_dict = json.loads(self.response)

        for key in response_dict:
            path = response_dict[key]

            if isinstance(path, str) and path.startswith("{{") and path.endswith("}}"):
                path = path[2:-2]
                for i, sub_path in enumerate(path.split(".")):
                    if i == 0:
                        res_data[key] = res[sub_path]
                    else:
                        if isinstance(res_data[key], list):
                            if int(sub_path) < len(res_data[key]):
                                res_data[key] = res_data[key][int(sub_path)]
                            else:
                                res_data[key] = ""
                                break
                        else:
                            res_data[key] = res_data[key][sub_path]
            else:
                res_data[key] = path

        return res_data
