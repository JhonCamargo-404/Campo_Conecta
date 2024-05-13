from urllib.parse import quote
import datetime

import pymysql.cursors


class OfferCRUD:
    def __init__(self, db_url):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='bryan',
            database='campo_conectabd',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

    def add_offer(self, labor_details, offer_details, image_paths, host_user_id):
        try:
            with self.connection.cursor() as cursor:
                # Insertar en la tabla labor_conditions
                sql_labor = """
                INSERT INTO labor_conditions (salary, feeding, workingHours, workingDay) 
                VALUES (%s, %s, %s, %s)
                """
                labor_values = (labor_details['salary'], labor_details['feeding'], labor_details['workingHours'],
                                labor_details['workingDay'])
                cursor.execute(sql_labor, labor_values)
                labor_id = cursor.lastrowid

                # Insertar en la tabla offer_info
                sql_offer_info = """
                INSERT INTO offer_info (name_offer, start_day, description, coordinates) 
                VALUES (%s, %s, %s, %s)
                """
                offer_info_values = (
                    offer_details['name_offer'], offer_details['start_day'], offer_details['description'],
                    offer_details['coordinates'])
                cursor.execute(sql_offer_info, offer_info_values)
                offer_info_id = cursor.lastrowid

                self.add_images_to_offer(offer_info_id, image_paths)

                # Crear el registro final en la tabla offer
                sql_offer = """
                INSERT INTO offer (id_host_user, id_labor_condition, id_offer_info) 
                VALUES (%s, %s, %s)
                """
                cursor.execute(sql_offer, (host_user_id, labor_id, offer_info_id))
                self.connection.commit()  # Asegura que los cambios se guarden.
                return {"status": "success", "message": "Offer added successfully"}
        except Exception as e:
            print("Error occurred:", e)
            self.connection.rollback()
        finally:
            # Se cierra la conexión en el destructor
            pass
        return {"status": "success", "message": "Offer added successfully"}

    def add_images_to_offer(self, offer_info_id, image_paths):
        try:
            with self.connection.cursor() as cursor:
                sql_image_offer = """
                INSERT INTO image_offer (id_offer_info, image_path) 
                VALUES (%s, %s)
                """
                for image_path in image_paths:
                    print(image_path)
                    cursor.execute(sql_image_offer, (offer_info_id, image_path))
                self.connection.commit()  # Asegúrate de hacer commit si las operaciones son exitosas
        except Exception as e:
            print(f"An error occurred: {e}")
            self.connection.rollback()
        finally:
            cursor.close()

    def add_offer_info(self, name_offer, start_day, description, coordinates, image):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                INSERT INTO offer_info (name_offer, start_day, description, coordinates, image) 
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (name_offer, start_day, description, coordinates, image))
                self.connection.commit()
                return cursor.lastrowid  # Devuelve el ID del nuevo registro insertado
        except Exception as e:
            print(f"An error occurred: {e}")
            self.connection.rollback()
        finally:
            cursor.close()

    def get_all_offers(self):
        with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
            SELECT 
                o.id_offer, 
                oi.name_offer, 
                oi.start_day, 
                oi.description, 
                oi.coordinates,
                hu.id_host_user, 
                hu.id_user AS host_user_id,
                a.id_applicant, 
                a.id_user AS applicant_user_id, 
                a.startDate, 
                a.finishDate,
                MIN(im.image_path) AS image_path  # Selecciona la primera imagen encontrada
            FROM offer o
            JOIN offer_info oi ON o.id_offer_info = oi.id_offer_info
            JOIN host_user hu ON o.id_host_user = hu.id_host_user
            LEFT JOIN applicant a ON o.id_applicant = a.id_applicant
            LEFT JOIN image_offer im ON oi.id_offer_info = im.id_offer_info
            GROUP BY o.id_offer  # Agrupa por oferta para evitar duplicados
            """
            cursor.execute(sql)
            results = cursor.fetchall()

            # Formatting the start_day and handling image path
            for offer in results:
                if offer['start_day'] and isinstance(offer['start_day'], datetime.date):
                    offer['start_day'] = offer['start_day'].strftime('%Y-%m-%d')
                if offer['image_path']:
                    cleaned_path = offer['image_path'].replace('../backend/offer_images/', '')
                    offer['image_url'] = f"http://localhost:8000/offer_images/{cleaned_path}"
                else:
                    offer['image_url'] = None

            return results

    def get_offer_by_id(self, offer_id):
        try:
            with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT 
                    o.id_offer, oi.name_offer, oi.start_day, oi.description, oi.coordinates,
                    hu.id_host_user, a.id_applicant, im.image_path,
                    lc.salary, lc.feeding
                FROM offer o
                JOIN offer_info oi ON o.id_offer_info = oi.id_offer_info
                JOIN host_user hu ON o.id_host_user = hu.id_host_user
                LEFT JOIN applicant a ON o.id_applicant = a.id_applicant
                LEFT JOIN image_offer im ON oi.id_offer_info = im.id_offer_info
                JOIN labor_conditions lc ON o.id_labor_condition = lc.id_labor_condition
                WHERE o.id_offer = %s
                """
                cursor.execute(sql, (offer_id,))
                results = cursor.fetchall()
                if results:
                    # Inicializa una lista vacía para almacenar URLs de imágenes
                    image_urls = []
                    # Itera sobre cada fila en los resultados
                    for result in results:
                        if result['image_path']:
                            filename = result['image_path'].split('/')[-1]
                            encoded_filename = quote(filename)
                            image_url = f"http://localhost:8000/offer_images/{encoded_filename}"
                            image_urls.append(image_url)
                    # Agrega la lista de URLs al primer resultado (asumiendo que los datos básicos de la oferta son iguales en todas las filas)
                    if image_urls:
                        results[0]['image_urls'] = image_urls
                    return results[0]
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def __del__(self):
        self.connection.close()
