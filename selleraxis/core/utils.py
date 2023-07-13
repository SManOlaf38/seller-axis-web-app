class DataUtilities:

    @staticmethod
    def from_data_to_object_ids(data):
        unique_ids = []
        if isinstance(data, list):
            for obj in data:
                unique_id = obj.get('id')
                if unique_id and unique_id not in unique_ids:
                    unique_ids.append(obj['id'])

        return unique_ids
