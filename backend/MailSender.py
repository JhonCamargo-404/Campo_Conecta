import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

# Obtener la clave de API de SendGrid
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

def enviar_correo(destinatario, asunto, contenido_html):
    # Crear una instancia del cliente de SendGrid
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    # Crear el correo electrónico
    message = Mail(
        from_email='campoconecta99@gmail.com',
        to_emails=destinatario,
        subject=asunto,
        html_content=contenido_html)

    # Enviar el correo
    try:
        response = sg.send(message)
        return {
            'status_code': response.status_code,
            'message_id': response.headers.get('X-Message-Id'),
            'response_body': response.body,
            'response_headers': response.headers
        }
    except Exception as e:
        return {
            'status_code': None,
            'error': str(e)
        }

