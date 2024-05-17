import pymysql.cursors
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'your_secret_key'

class UserCRUD:
    def __init__(self, db_url):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='root',
            database='campo_conectabd',
            cursorclass=pymysql.cursors.DictCursor
        )

    def register_user(self, user_name, user_last_name, email, password):
        if self.check_email_exists(email):
            return {"success": False, "message": "El correo electrónico ya está registrado"}

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        with self.connection.cursor() as cursor:
            sql = "INSERT INTO Info_User (user_name, user_last_name) VALUES (%s, %s)"
            cursor.execute(sql, (user_name, user_last_name))
            user_id = cursor.lastrowid
            sql = "INSERT INTO User_Credentials (user_password, email, rol) VALUES (%s, %s, %s)"
            cursor.execute(sql, (hashed_password, email, 'U'))

        self.connection.commit()
        return {"success": True, "message": "Usuario registrado con éxito"}

    def check_email_exists(self, email):
        with self.connection.cursor() as cursor:
            sql = "SELECT COUNT(*) AS count FROM User_Credentials WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()
            return result['count'] > 0

    def login(self, email, password):
        with self.connection.cursor() as cursor:
            sql = "SELECT user_password FROM User_Credentials WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()
            if result:
                hashed_password = result['user_password']
                hashed_password_utf8 = hashed_password.encode('utf-8')
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password_utf8):
                    return self.create_jwt(email)
                else:
                    return None
            else:
                return None

    def create_jwt(self, email):
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token

    def update_password(self, email, current_password, new_password):
        if not self.login(email, current_password):
            print("Credenciales incorrectas. No se puede actualizar la contraseña.")
            return

        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        with self.connection.cursor() as cursor:
            sql = "UPDATE User_Credentials SET user_password = %s WHERE email = %s"
            cursor.execute(sql, (hashed_new_password, email))

        self.connection.commit()
        print("Contraseña actualizada con éxito.")

    def __del__(self):
        self.connection.close()
