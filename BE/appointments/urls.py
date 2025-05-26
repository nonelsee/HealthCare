# BE/appointments/urls.py
from django.urls import path
from . import views
from .view_ai import GoogleChatAPIView

urlpatterns = [
    path('chat-google/', GoogleChatAPIView.as_view(), name='chat-google-ai'),  # Thêm dòng này
    # Doctor schedule management
    path('schedules/', views.DoctorScheduleListCreateView.as_view(), name='schedule-list-create'),
    path('schedules/<int:pk>/', views.DoctorScheduleDetailView.as_view(), name='schedule-detail'),

    # Patient booking
    path('doctors/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:doctor_id>/schedules/', views.DoctorScheduleView.as_view(), name='doctor-schedules'),
    path('book/', views.BookAppointmentView.as_view(), name='book-appointment'),

    # Appointment management
    path('patient/appointments/', views.PatientAppointmentListView.as_view(), name='patient-appointments'),
    path('doctor/appointments/', views.DoctorAppointmentListView.as_view(), name='doctor-appointments'),
    path('appointments/<int:appointment_id>/cancel/', views.CancelAppointmentView.as_view(), name='cancel-appointment'),
]