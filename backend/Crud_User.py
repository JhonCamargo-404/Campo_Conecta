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

    def register_user(self, user_name, user_last_name, email, password, age):
        if self.check_email_exists(email):
            return {"success": False, "message": "El correo electrónico ya está registrado"}

        if int(age) < 18:
            return {"success": False, "message": "Debes ser mayor de 18 años"}

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        try:
            with self.connection.cursor() as cursor:
                # Insertar en Info_User
                sql = "INSERT INTO Info_User (user_name, user_last_name, age) VALUES (%s, %s, %s)"
                cursor.execute(sql, (user_name, user_last_name, age))
                info_user_id = cursor.lastrowid  # ID generado para Info_User

                # Insertar en User_Credentials
                sql = "INSERT INTO User_Credentials (user_password, email, rol) VALUES (%s, %s, %s)"
                cursor.execute(sql, (hashed_password, email, 'U'))
                user_credentials_id = cursor.lastrowid  # ID generado para User_Credentials

                # Insertar en users
                sql = "INSERT INTO users (id_user_credentials, id_info_user) VALUES (%s, %s)"
                cursor.execute(sql, (user_credentials_id, info_user_id))

            self.connection.commit()  # Confirmar todos los cambios si todo es correcto
            return {"success": True, "message": "Usuario registrado con éxito"}
        except Exception as e:
            self.connection.rollback()  # Revertir cambios si hay un error
            return {"success": False, "message": str(e)}

    def register_admin(self, user_name, user_last_name, email, password, age):
        if self.check_email_exists(email):
            return {"success": False, "message": "El correo electrónico ya está registrado"}

        if int(age) < 18:
            return {"success": False, "message": "Debes ser mayor de 18 años"}

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        try:
            with self.connection.cursor() as cursor:
                # Insertar en Info_User
                sql = "INSERT INTO Info_User (user_name, user_last_name, age) VALUES (%s, %s, %s)"
                cursor.execute(sql, (user_name, user_last_name, age))
                info_user_id = cursor.lastrowid  # ID generado para Info_User

                # Insertar en User_Credentials
                sql = "INSERT INTO User_Credentials (user_password, email, rol) VALUES (%s, %s, %s)"
                cursor.execute(sql, (hashed_password, email, 'A'))
                user_credentials_id = cursor.lastrowid  # ID generado para User_Credentials

                # Insertar en users
                sql = "INSERT INTO users (id_user_credentials, id_info_user) VALUES (%s, %s)"
                cursor.execute(sql, (user_credentials_id, info_user_id))

            self.connection.commit()  # Confirmar todos los cambios si todo es correcto
            return {"success": True, "message": "Usuario registrado con éxito"}
        except Exception as e:
            self.connection.rollback()  # Revertir cambios si hay un error
            return {"success": False, "message": str(e)}

    def check_email_exists(self, email):
        with self.connection.cursor() as cursor:
            sql = "SELECT COUNT(*) AS count FROM User_Credentials WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()
            return result['count'] > 0

    def login(self, email, password):
        with self.connection.cursor() as cursor:
            sql = "SELECT id_User_Credentials, user_password, rol FROM User_Credentials WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()
            if result:
                user_credentials_id = result['id_User_Credentials']
                hashed_password = result['user_password']
                rol = result['rol']
                hashed_password_utf8 = hashed_password.encode('utf-8')
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password_utf8):
                    sql = "SELECT id_user FROM users WHERE id_user_credentials = %s"
                    cursor.execute(sql, (user_credentials_id,))
                    user_result = cursor.fetchone()
                    if user_result:
                        user_id = user_result['id_user']
                        return self.create_jwt(email, user_id, rol)
                return None
            else:
                return None

    def create_jwt(self, email, id_user, rol):
        payload = {
            "email": email,
            "id_user": id_user,
            "rol": rol,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token

    def update_password(self, email, new_password):
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        with self.connection.cursor() as cursor:
            sql = "UPDATE User_Credentials SET user_password = %s WHERE email = %s"
            cursor.execute(sql, (hashed_new_password, email))

        self.connection.commit()
        print("Contraseña actualizada con éxito.")
        
        
    def get_cv(self, user_id):
        try:
            with self.connection.cursor() as cursor:
                sql = "SELECT cv FROM info_User WHERE id_info_user=%s"
                cursor.execute(sql, (user_id,))
                result = cursor.fetchone()
                if result and result['cv']:
                    # Asume que los CVs están almacenados en una carpeta accesible desde el servidor
                    filename = result['cv'].split('/')[-1]  # Asume que el path almacena el nombre del archivo
                    return f"http://localhost:8000/cv_storage/{filename}"  # Ajusta la ruta según la configuración de tu servidor
                return None
        except Exception as e:
            print(f"Error getting CV path: {e}")
            return None

    def update_cv_path(self, user_id, cv_path):
        try:
            with self.connection.cursor() as cursor:
                sql = "UPDATE info_User SET cv=%s WHERE id_info_user=%s"
                cursor.execute(sql, (cv_path, user_id))
                self.connection.commit()
                return True
        except Exception as e:
            print(f"Error updating CV path: {e}")
            self.connection.rollback()
            return False

    def get_user_id_by_email(self, email):
        try:
            with self.connection.cursor() as cursor:
                # Consulta para obtener el id_user_credentials basado en el email
                sql = "SELECT id_User_Credentials FROM User_Credentials WHERE email = %s"
                cursor.execute(sql, (email,))
                result = cursor.fetchone()
                if result:
                    user_credentials_id = result['id_User_Credentials']

                    # Consulta para obtener el id_user usando id_user_credentials
                    sql = "SELECT id_user FROM users WHERE id_user_credentials = %s"
                    cursor.execute(sql, (user_credentials_id,))
                    result = cursor.fetchone()
                    if result:
                        return result['id_user']

                return None
        except Exception as e:
            print(f"Error retrieving user ID by email: {e}")
            return None

    def get_users(self):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT u.id_user, iu.user_name, iu.user_last_name, iu.age, uc.email, uc.rol 
                    FROM users u
                    JOIN info_user iu ON u.id_info_user = iu.id_info_user
                    JOIN user_credentials uc ON u.id_user_credentials = uc.id_user_credentials
                    WHERE uc.rol = 'U'
                """)
                users = cursor.fetchall()
                return users
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def delete_user(self, id_user):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE id_user = %s", (id_user,))
                if not cursor.fetchone():
                    return False
                cursor.execute("DELETE FROM users WHERE id_user = %s", (id_user,))
                self.connection.commit()
                return True
        except Exception as e:
            self.connection.rollback()
            print(f"An error occurred: {e}")
            return False

    def __del__(self):
        self.connection.close()
