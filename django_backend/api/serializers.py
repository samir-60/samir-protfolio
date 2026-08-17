import html
from rest_framework import serializers

class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, required=False, allow_blank=True, default='Portfolio Visitor')
    email = serializers.EmailField(max_length=254, required=True)
    subject = serializers.CharField(max_length=200, required=False, allow_blank=True, default='Portfolio Inquiry')
    message = serializers.CharField(max_length=5000, required=True)

    def validate_name(self, value):
        # Escape any raw HTML tags in name
        clean = html.escape(value.strip())
        return clean if clean else 'Portfolio Visitor'

    def validate_subject(self, value):
        clean = html.escape(value.strip())
        return clean if clean else 'Portfolio Inquiry'

    def validate_message(self, value):
        clean = html.escape(value.strip())
        if not clean:
            raise serializers.ValidationError("Message content cannot be empty.")
        return clean
