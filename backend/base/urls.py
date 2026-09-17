from django.urls import path
from base.views import SettingsResponsiblePersonListCreateApiView, SettingsResponsiblePersonDetailApiView

urlpatterns = [
    path("settings/responsible-persons/", SettingsResponsiblePersonListCreateApiView.as_view()),
    path("settings/responsible-persons/<int:pk>/", SettingsResponsiblePersonDetailApiView.as_view()),
]
