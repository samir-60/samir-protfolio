from django.urls import path
from .views import ContactAPIView, HealthCheckView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('contact/', ContactAPIView.as_view(), name='contact'),
]
