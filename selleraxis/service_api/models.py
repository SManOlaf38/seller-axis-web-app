import copy
import json

import jinja2
import requests
from django.db import models
from rest_framework.exceptions import APIException

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

    def read_response_data(self, res, response_format):
        res_data = {}

        for key in response_format:
            path = response_format[key]

            if isinstance(path, str) and path.startswith("{{") and path.endswith("}}"):
                path = path[2:-2]
                for i, sub_path in enumerate(path.split(".")):
                    if i == 0:
                        res_data[key] = res[sub_path]
                    else:
                        if isinstance(res_data[key], list):
                            if len(res_data[key]) > int(sub_path):
                                res_data[key] = res_data[key][int(sub_path)]
                            else:
                                res_data[key] = ""
                        else:
                            res_data[key] = res_data[key][sub_path]
            elif isinstance(path, dict):
                if path["type"] == "list":
                    res_data[key] = []
                    sub_path = path["field"][2:-2]

                    sub_res_data = copy.copy(res_data)

                    for i, sub_path in enumerate(sub_path.split(".")):
                        if i == 0:
                            sub_res_data[key] = res[sub_path]
                        else:
                            if isinstance(sub_res_data[key], list):
                                sub_res_data[key] = sub_res_data[key][int(sub_path)]
                            else:
                                sub_res_data[key] = sub_res_data[key][sub_path]

                    if isinstance(sub_res_data[key], list):
                        for data_item in sub_res_data[key]:
                            res_data[key].append(
                                self.read_response_data(data_item, path["data"])
                            )

                    if isinstance(sub_res_data[key], dict):
                        res_data[key].append(
                            self.read_response_data(sub_res_data[key], path["data"])
                        )
            else:
                res_data[key] = path

        return res_data

    def request(self, data, is_sandbox=True):
        if "batch" in data:
            print("OK")
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
        )

        res = res.json()

        response_format = json.loads(self.response)

        try:
            return self.read_response_data(res, response_format)
        except KeyError:
            raise APIException(res)
