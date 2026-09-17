from rest_framework import serializers
from .models import ResponsiblePerson


class ResponsiblePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponsiblePerson
        fields = ["id", "full_name", "position", "employee_slug"]
