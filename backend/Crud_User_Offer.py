import pymysql


class CrudUserOffer:
    def __init__(self, db_url):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='bryan',
            database='campo_conectabd',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
