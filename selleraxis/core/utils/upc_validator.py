"""Implement UPC validator"""


class FormatException(Exception):
    pass


class UPCValidator:
    @staticmethod
    def prepare_code_string(code_string: str) -> str:
        retval = code_string.replace("-", "")
        retval = retval.replace(" ", "")
        return retval.strip()

    @staticmethod
    def calculate_upc_checkdigit(first_11_numbers: str) -> str:
        if len(first_11_numbers) != 11 or not first_11_numbers.isnumeric():
            raise FormatException("Improper format in first 11 numbers of UPC")

        checksum = 0
        for count, digit in enumerate(first_11_numbers):
            weight = 1 + (((count + 1) % 2) * 2)
            checksum += int(digit) * weight
        checkdigit = (10 - (checksum % 10)) % 10
        return str(checkdigit)

    @staticmethod
    def validate_upc(code_string: str) -> bool:
        upc_string = UPCValidator.prepare_code_string(code_string)
        if len(upc_string) != 12:
            return False
        retval = (
            UPCValidator.calculate_upc_checkdigit(upc_string[:-1]) == upc_string[-1:]
        )
        return retval
