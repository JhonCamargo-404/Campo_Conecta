from fastapi import HTTPException
from starlette import status
import pymysql.cursors


class CrudUserOffer:
    def __init__(self, db_url):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='root',
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
                    uc.email,
                    iu.user_name,
                    iu.user_last_name,
                    iu.age,
                    iu.cv
                FROM offer_applicant oa
                LEFT JOIN applicant a ON oa.id_applicant = a.id_applicant
                LEFT JOIN users u ON a.id_user = u.id_user
                LEFT JOIN user_credentials uc ON u.id_user = uc.id_user_credentials
                LEFT JOIN info_user iu ON u.id_user = iu.id_info_user
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

    def get_user_applications(self, id_user):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                SELECT 
                    o.id_offer, 
                    oa.id_applicant,
                    oa.estado, 
                    oi.name_offer, 
                    oi.description,
                    MIN(io.image_path) AS image_path  
                FROM offer_applicant oa
                JOIN offer o ON oa.id_offer = o.id_offer
                JOIN offer_info oi ON o.id_offer = oi.id_offer_info
                LEFT JOIN image_offer io ON oi.id_offer_info = io.id_offer_info  
                WHERE oa.id_applicant IN (
                    SELECT id_applicant FROM applicant WHERE id_user=%s
                )
                GROUP BY o.id_offer, oa.id_applicant, oa.estado, oi.name_offer, oi.description 
                """
                cursor.execute(sql, (id_user,))
                results = cursor.fetchall()

                for offer in results:
                    if offer['image_path']:
                        # Asegúrate de que la ruta de la imagen es accesible públicamente y correcta
                        offer['image_url'] = f"http://localhost:8000/offer_images/{offer['image_path'].split('/')[-1]}"
                    else:
                        offer['image_url'] = None
                return results
        except Exception as e:
            print(f"Error retrieving user applications: {e}")
            return []

    def update_applicant_status(self, id_applicant: int, status: str):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                      UPDATE offer_applicant
                      SET estado = %s
                      WHERE id_applicant = %s
                  """
                cursor.execute(sql, (status, id_applicant))
                if cursor.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Applicant not found")
                self.connection.commit()
                return {"success": True, "message": f"Applicant status updated to {status}"}
        except pymysql.MySQLError as e:
            print(f"Database error: {e}")
            self.connection.rollback()
            raise HTTPException(status_code=500, detail="Failed to update applicant status")

    def __del__(self):
        self.connection.close()
