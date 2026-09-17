from django.contrib import admin
from .models import ResponsiblePerson


@admin.register(ResponsiblePerson)
class ResponsiblePersonAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'employee_slug')
    search_fields = ('full_name', 'position', 'employee_slug')
