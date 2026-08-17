import logging
from datetime import datetime
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)

class HealthCheckView(APIView):
    """
    Healthcheck & Security Posture Probe
    """
    throttle_classes = []

    def get(self, request):
        return Response({
            'status': 'healthy',
            'engine': 'Django Enterprise Security REST API',
            'security': {
                'xss_filter': True,
                'nosniff': True,
                'rate_limiting': 'Active (Scoped 5/min)',
                'tls_encryption': 'Enforced (Gmail SMTP 587)'
            },
            'admin_target': settings.EMAIL_HOST_USER,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }, status=status.HTTP_200_OK)


class ContactAPIView(APIView):
    """
    High-Security Contact Message Endpoint with Throttling & Dual Gmail Dispatch
    """
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        sender_name = data.get('name')
        sender_email = data.get('email')
        sender_subject = data.get('subject')
        message_body = data.get('message')

        admin_email = settings.EMAIL_HOST_USER

        try:
            # 1. ADMIN NOTIFICATION EMAIL TO SAMIR
            admin_subject = f"🚀 Portfolio Message from {sender_name}: {sender_subject}"
            admin_plain = f"From: {sender_name} ({sender_email})\nSubject: {sender_subject}\n\nMessage:\n{message_body}"
            admin_html = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0b0f17; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
              <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">New Portfolio Message Received</h2>
                <p style="color: #94a3b8; font-size: 13px; margin: 5px 0 0 0;">Received via Secure Django API • {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold; width: 100px;">SENDER:</td>
                  <td style="padding: 8px 0; color: #f8fafc; font-size: 14px; font-weight: 600;">{sender_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">EMAIL:</td>
                  <td style="padding: 8px 0; color: #38bdf8; font-size: 14px;"><a href="mailto:{sender_email}" style="color: #38bdf8; text-decoration: none;">{sender_email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">SUBJECT:</td>
                  <td style="padding: 8px 0; color: #f8fafc; font-size: 14px;">{sender_subject}</td>
                </tr>
              </table>

              <div style="background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 18px; margin-bottom: 25px;">
                <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">MESSAGE CONTENT</div>
                <div style="color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{message_body}</div>
              </div>

              <div style="text-align: center;">
                <a href="mailto:{sender_email}?subject=Re:%20{sender_subject}" style="background: #38bdf8; color: #0b0f17; font-weight: bold; font-size: 13px; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reply Directly to {sender_name}</a>
              </div>
            </div>
            """

            admin_mail = EmailMultiAlternatives(
                subject=admin_subject,
                body=admin_plain,
                from_email=f'"{sender_name} via Portfolio" <{admin_email}>',
                to=[admin_email],
                reply_to=[sender_email]
            )
            admin_mail.attach_alternative(admin_html, "text/html")
            admin_mail.send(fail_silently=False)

            # 2. AUTO-CONFIRMATION EMAIL TO SENDER
            sender_confirm_subject = f"Thank you for reaching out, {sender_name}! — Samir Qureshi"
            sender_confirm_plain = f"Hi {sender_name},\n\nThank you for reaching out! Samir has received your message regarding \"{sender_subject}\" and will reply shortly."
            sender_confirm_html = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0b0f17; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
              <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">Message Received Successfully</h2>
                <p style="color: #94a3b8; font-size: 13px; margin: 5px 0 0 0;">Samir Qureshi • Portfolio Direct Channel</p>
              </div>
              
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi {sender_name},</p>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Thank you for getting in touch! I have received your message regarding "<strong>{sender_subject}</strong>".</p>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">I will review your inquiry and respond back to you directly at this email address as soon as possible.</p>

              <div style="background: #111827; border-left: 3px solid #38bdf8; padding: 12px 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
                <div style="color: #64748b; font-size: 11px; font-weight: bold; margin-bottom: 4px;">YOUR MESSAGE COPY:</div>
                <div style="color: #94a3b8; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">{message_body}</div>
              </div>

              <div style="border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px; font-size: 12px; color: #64748b;">
                <strong style="color: #f8fafc;">Samir Qureshi</strong><br />
                B.Sc. in Computer Science & Engineering (Metropolitan University, Sylhet)<br />
                Full-Stack Web Developer, Cybersecurity Specialist & Tech Entrepreneur<br />
                GitHub: <a href="https://github.com/samir-60" style="color: #38bdf8;">github.com/samir-60</a> | WhatsApp: <a href="https://wa.me/8801725198663" style="color: #38bdf8;">+8801725198663</a>
              </div>
            </div>
            """

            confirm_mail = EmailMultiAlternatives(
                subject=sender_confirm_subject,
                body=sender_confirm_plain,
                from_email=f"Samir Qureshi <{admin_email}>",
                to=[sender_email]
            )
            confirm_mail.attach_alternative(sender_confirm_html, "text/html")
            confirm_mail.send(fail_silently=False)

            return Response({
                'success': True,
                'message': 'Message sent and verified via Secure Django Backend.'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("Django mail delivery error: %s", str(e))
            return Response({
                'success': False,
                'error': f'Delivery error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
