def convert_weight(weight_value, weight_unit):
    """Convert weight.

    Args:
        weight_unit: An string.
        weight_value: An float.
    Returns:
        Float.
    Raises:
        None
    """
    convert_value = {
        "KG": 2.2046226218488,
    }
    result = weight_value
    if weight_unit not in ["LB", "LBS"]:
        convert_ratio = convert_value.get(weight_unit)
        if convert_ratio is not None:
            return round(result * convert_ratio, 2)

    return round(result, 2)
