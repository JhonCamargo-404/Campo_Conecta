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
                    ic.email,
                    iu.user_name,
                    iu.user_last_name,
                    iu.age,
                    iu.cv
                FROM applicant a
                JOIN users u ON a.id_user = u.id_user
                JOIN user_Credentials ic ON u.id_user_credentials = ic.id_User_Credentials
                JOIN info_User iu ON u.id_info_user = iu.id_info_user
                WHERE a.id_offer = %s
                """
                cursor.execute(sql, (id_offer,))
                results = cursor.fetchall()
                for result in results:
                    if result['cv']:
                        result['cv'] = f"http://localhost:8000/cv_storage/{result['cv'].split('/')[-1]}"
                return results
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

