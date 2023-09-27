class DataUtilities:
    @staticmethod
    def from_data_to_object_ids(data):
        unique_ids = []
        if isinstance(data, list):
            for obj in data:
                unique_id = obj.get("id")
                if unique_id and unique_id not in unique_ids:
                    unique_ids.append(obj["id"])

        return unique_ids

    @staticmethod
    def convert_list_id_to_unique(data):
        result = {}
        for key, value in data.items():
            unique_values = list(set(value))
            result[key] = unique_values
        return result
