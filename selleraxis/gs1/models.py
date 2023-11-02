from django.db import models

from selleraxis.gs1.exceptions import GS1FullException
from selleraxis.organizations.models import Organization


class GS1(models.Model):
    name = models.CharField(max_length=256)
    gs1 = models.CharField(max_length=10)
    next_serial_number = models.IntegerField(default=0)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="gs1"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_sscc(self, amount=1):
        sscc_list = []
        serial_number_length = 16 - len(self.gs1)

        for i in range(amount):
            serial_number_str = str(self.next_serial_number)

            if len(serial_number_str) > serial_number_length:
                raise GS1FullException()

            sscc = f"0{self.gs1}{'0'*(serial_number_length - len(serial_number_str))}{serial_number_str}"

            total = 0
            for index, item in enumerate(sscc):
                if index % 2 == 0:
                    total = total + int(item) * 3
                else:
                    total = total + int(item)

            rest = total % 10
            check_digit = (10 - rest) % 10
            sscc += str(check_digit)

            self.next_serial_number += 1

            sscc_list.append(sscc)

        self.save()

        return sscc_list
