def get_next_sscc_value(sscc_var, sscc_prefix):
    target = sscc_prefix + sscc_var
    total = 0
    for index, item in enumerate(target):
        if index % 2 == 1:
            total = total + int(item) * 3
        else:
            total = total + int(item)

    rest = total % 10
    check_digit = (10 - rest) % 10
    sscc_var_value = target + str(check_digit)
    return sscc_var_value


def extract_substring(input_string, start_index, length):
    return input_string[start_index : start_index + length]  # noqa: E203


def generate_numbers(start, length):
    numbers = []
    for i in range(length):
        number = start + i
        numbers.append(str(number).zfill(5))
    return numbers
