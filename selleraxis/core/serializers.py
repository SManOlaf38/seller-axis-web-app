from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ListSerializer, ModelSerializer


class BulkUpdateListSerializer(ListSerializer):
    def update(self, instance, validated_data):
        instance_dict = {index: i for index, i in enumerate(instance)}
        update_object_list = [
            self.child.update(instance_dict[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        if isinstance(self.child.Meta.fields, str):
            fields = dict(self.child.fields.fields)
        else:
            fields = self.child.Meta.fields

        update_fields = [
            field
            for field in fields
            if field not in self.child.Meta.read_only_fields
        ]

        try:
            self.child.Meta.model.objects.bulk_update(update_object_list, update_fields)
        except IntegrityError as e:
            raise ValidationError(e)
        except Exception as e:
            raise ValidationError(e)

        return update_object_list


class BulkUpdateModelSerializer(ModelSerializer):
    class Meta:
        fields = "__all__"
        list_serializer_class = BulkUpdateListSerializer
        read_only_fields = ('id',)
