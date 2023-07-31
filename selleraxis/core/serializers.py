from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ListSerializer, ModelSerializer


class BulkUpdateListSerializer(ListSerializer):
    def to_internal_value(self, data):
        validate_data = []
        errors = []
        for obj in data:
            try:
                self.child.instance = self.instance.get(id=obj["id"])
                self.child.initial_data = obj
                validated = self.child.run_validation(obj)

            except ValidationError as exc:
                errors.append(exc.detail)
            else:
                validate_data.append(validated)
                errors.append({})

        if any(errors):
            raise ValidationError(errors)

        return validate_data

    def update(self, instances, validated_data):
        instance_dict = {instance.pk: instance for instance in instances}
        update_object_list = []
        for attrs in validated_data:
            instance = instance_dict.get(attrs["id"])
            for attr in attrs:
                arg = getattr(instance, attr)
                if arg not in ["id", "pk"]:
                    setattr(instance, attr, attrs[attr])

            update_object_list.append(instance)

        if isinstance(self.child.Meta.fields, str):
            fields = dict(self.child.fields.fields)
        else:
            fields = self.child.Meta.fields

        update_fields = [
            field for field in fields if field not in self.child.Meta.read_only_fields
        ]

        try:
            self.child.Meta.model.objects.bulk_update(update_object_list, update_fields)
        except IntegrityError as e:
            raise ValidationError(e)
        except Exception as e:
            raise ValidationError(e)

        return update_object_list


class BulkUpdateModelSerializer(ModelSerializer):
    def to_internal_value(self, data):
        return data

    class Meta:
        fields = "__all__"
        list_serializer_class = BulkUpdateListSerializer
