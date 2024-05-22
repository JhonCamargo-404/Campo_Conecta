from fastapi import HTTPException
from starlette import status
import pymysql.cursors

class CrudUserOffer:
    def __init__(self, db_url):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='bryan',
            database='campo_conectabd',
            cursorclass=pymysql.cursors.DictCursor
        )

    def get_applicants_for_offer(self, id_offer):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                SELECT 
                    a.id_applicant,
                    u.id_user,
                    ic.email,
                    iu.user_name,
                    iu.user_last_name,
                    iu.age,
                    iu.cv
                FROM offer_applicant oa
                JOIN applicant a ON oa.id_applicant = a.id_applicant
                JOIN users u ON a.id_user = u.id_user
                JOIN user_Credentials ic ON u.id_user_credentials = ic.id_User_Credentials
                JOIN info_User iu ON u.id_info_user = iu.id_info_user
                WHERE oa.id_offer = %s
                """
                cursor.execute(sql, (id_offer,))
                results = cursor.fetchall()
                for result in results:
                    if result['cv']:
                        # Asume que los CVs están almacenados en una carpeta accesible desde el servidor
                        filename = result['cv'].split('/')[-1]  # Asume que el path almacena el nombre del archivo
                        result[
                            'cv'] = f"http://localhost:8000/cv_storage/{filename}"  # Ajusta la ruta según la configuración de tu servidor
                return results
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def get_or_create_host_user(self, id_user):
        try:
            with self.connection.cursor() as cursor:
                # Check if the host_user already exists
                sql_check = "SELECT id_host_user FROM host_user WHERE id_user = %s"
                cursor.execute(sql_check, (id_user,))
                result = cursor.fetchone()

                if result:
                    return result['id_host_user']

                # If not exists, create a new host_user
                sql_insert = "INSERT INTO host_user (id_user) VALUES (%s)"
                cursor.execute(sql_insert, (id_user,))
                self.connection.commit()

                return cursor.lastrowid

        except Exception as e:
            self.connection.rollback()
            print(f"Unexpected error: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="An unexpected error occurred")

    def get_user_applications(self, user_id):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                SELECT o.id_offer, oa.estado, oi.name_offer, oi.description
                FROM offer_applicant oa
                JOIN offer o ON oa.id_offer = o.id_offer
                JOIN offer_info oi ON o.id_offer_info = oi.id_offer_info
                WHERE oa.id_applicant IN (
                    SELECT id_applicant FROM applicant WHERE id_user=%s
                )
                """
                cursor.execute(sql, (user_id,))
                return cursor.fetchall()  # Devuelve una lista de diccionarios con los datos de las ofertas
        except Exception as e:
            print(f"Error retrieving user applications: {e}")
            return []

