from django.db import models


class ResponsiblePerson(models.Model):
    full_name = models.CharField(max_length=255, verbose_name='ФИО ответственного лица')
    position = models.CharField(max_length=255, verbose_name='Должность ответственного лица')
    employee_slug = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name='Slug сотрудника (employee_service)',
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = 'Ответственное лицо'
        verbose_name_plural = 'Ответственные лица'
