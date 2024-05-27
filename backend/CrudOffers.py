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
            cursorclass=pymysql.cursors.DictCursor
        )

    def add_offer(self, labor_details, offer_details, image_paths, host_user_id):
        try:
            with self.connection.cursor() as cursor:
                # Insertar en la tabla offer
                sql_offer = """
                INSERT INTO offer (id_host_user) 
                VALUES (%s)
                """
                cursor.execute(sql_offer, (host_user_id,))
                offer_id = cursor.lastrowid

                # Insertar en la tabla labor_conditions
                sql_labor = """
                INSERT INTO labor_conditions (id_labor_conditions, salary, feeding, workingHours, workingDay) 
                VALUES (%s, %s, %s, %s, %s)
                """
                labor_values = (offer_id, labor_details['salary'], labor_details['feeding'], labor_details['workingHours'], labor_details['workingDay'])
                cursor.execute(sql_labor, labor_values)

                # Insertar en la tabla offer_info
                sql_offer_info = """
                INSERT INTO offer_info (id_offer_info, name_offer, start_day, description, municipality, coordinates) 
                VALUES (%s, %s, %s, %s, %s, %s)
                """
                offer_info_values = (offer_id, offer_details['name_offer'], offer_details['start_day'], offer_details['description'], offer_details['municipality'], offer_details['coordinates'])
                cursor.execute(sql_offer_info, offer_info_values)

                self.add_images_to_offer(offer_id, image_paths)

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
                oi.municipality, 
                oi.description, 
                oi.coordinates,
                hu.id_host_user, 
                hu.id_user AS host_user_id,
                MIN(im.image_path) AS image_path  # Selecciona la primera imagen encontrada
            FROM offer o
            JOIN offer_info oi ON o.id_offer = oi.id_offer_info
            JOIN host_user hu ON o.id_host_user = hu.id_host_user
            LEFT JOIN image_offer im ON oi.id_offer_info = im.id_offer_info
            GROUP BY o.id_offer
            """
            cursor.execute(sql)
            results = cursor.fetchall()

            # Formatting the start_day and handling image path
            for offer in results:
                if offer['start_day'] and isinstance(offer['start_day'], datetime.date):
                    offer['start_day'] = offer['start_day'].strftime('%Y-%m-%d')
                if offer['image_path']:
                    cleaned_path = offer['image_path'].replace('../backend/offer_images/', '')
                    offer['image_url'] = f"http://localhost:8000/{cleaned_path}"
                else:
                    offer['image_url'] = None

            return results

    def get_offers_for_user(self, id_user):
        with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
            SELECT
                o.id_offer,
                oi.name_offer,
                oi.start_day,
                oi.description,
                oi.coordinates,
                hu.id_host_user,
                GROUP_CONCAT(im.image_path) AS image_path
            FROM offer o
            JOIN offer_info oi ON o.id_offer = oi.id_offer_info
            JOIN host_user hu ON o.id_host_user = hu.id_host_user
            LEFT JOIN image_offer im ON oi.id_offer_info = im.id_offer_info
            WHERE hu.id_user = %s
            GROUP BY o.id_offer, oi.name_offer, oi.start_day, oi.description, oi.coordinates, hu.id_host_user
            """
            cursor.execute(sql, (id_user,))
            results = cursor.fetchall()

            # Formateando la fecha de inicio y manejo de la ruta de la imagen
            for offer in results:
                if offer['start_day'] and isinstance(offer['start_day'], datetime.date):
                    offer['start_day'] = offer['start_day'].strftime('%Y-%m-%d')
                if offer['image_path']:
                    cleaned_path = offer['image_path'].replace('../backend/offer_images/', '')
                    offer['image_url'] = f"http://localhost:8000/{cleaned_path}"
                else:
                    offer['image_url'] = None

            return results

    def get_offer_by_id(self, offer_id):
        try:
            with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT 
                    o.id_offer, 
                    oi.name_offer, 
                    oi.start_day, 
                    oi.description, 
                    oi.coordinates,
                    oi.municipality,
                    hu.id_host_user, 
                    lc.salary, 
                    lc.feeding,
                    oi.id_offer_info,
                    GROUP_CONCAT(DISTINCT oa.id_applicant) AS applicants
                FROM offer o
                JOIN offer_info oi ON o.id_offer = oi.id_offer_info
                JOIN host_user hu ON o.id_host_user = hu.id_host_user
                LEFT JOIN offer_applicant oa ON o.id_offer = oa.id_offer
                LEFT JOIN applicant a ON oa.id_applicant = a.id_applicant
                JOIN labor_conditions lc ON o.id_offer = lc.id_labor_conditions
                WHERE o.id_offer = %s
                GROUP BY o.id_offer, oi.name_offer, oi.start_day, oi.description, oi.coordinates, hu.id_host_user, lc.salary, lc.feeding, oi.id_offer_info

                """
                cursor.execute(sql, (offer_id,))
                result = cursor.fetchone()
                if result:
                    # Obtener todas las imágenes asociadas con la oferta
                    cursor.execute("SELECT image_path FROM image_offer WHERE id_offer_info = %s",
                                   (result['id_offer_info'],))
                    images = cursor.fetchall()

                    # Inicializa una lista vacía para almacenar URLs de imágenes
                    image_urls = []
                    for image in images:
                        if image['image_path']:
                            filename = image['image_path'].split('/')[-1]
                            encoded_filename = quote(filename)
                            image_url = f"http://localhost:8000/offer_images/{encoded_filename}"
                            image_urls.append(image_url)

                    # Agrega la lista de URLs a los resultados
                    result['image_urls'] = image_urls

                    # Convierte la cadena concatenada de applicants en una lista de enteros
                    result['applicants'] = [int(a) for a in result['applicants'].split(',')] if result[
                        'applicants'] else []

                    return result
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def get_disabled_dates(self, id_offer):
        try:
            with self.connection.cursor() as cursor:
                # Consulta actualizada para obtener las fechas de los aplicantes relacionados con una oferta específica
                sql = """
                SELECT a.startDate, a.finishDate
                FROM applicant a
                JOIN offer_applicant oa ON a.id_applicant = oa.id_applicant
                WHERE oa.id_offer = %s
                """
                cursor.execute(sql, (id_offer,))
                return cursor.fetchall()
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def add_applicant(self, id_user, start_date, finish_date):
        try:
            with self.connection.cursor() as cursor:
                sql_applicant = """
                INSERT INTO applicant (id_user, startDate, finishDate)
                VALUES (%s, %s, %s)
                """
                cursor.execute(sql_applicant, (id_user, start_date, finish_date))
                self.connection.commit()
                return cursor.lastrowid  # Devuelve el ID del nuevo registro insertado
        except Exception as e:
            print("Error occurred while adding applicant:", e)
            self.connection.rollback()
            return None

    def associate_applicant_with_offer(self, id_applicant, id_offer):
        try:
            with self.connection.cursor() as cursor:
                # Comprobar si la asociación ya existe
                sql_check = """
                SELECT COUNT(*) AS count FROM offer_applicant
                WHERE id_applicant = %s AND id_offer = %s
                """
                cursor.execute(sql_check, (id_applicant, id_offer))
                result = cursor.fetchone()
                if result['count'] > 0:
                    print("Association already exists.")
                    return False  # La asociación ya existe, no se realiza ninguna acción

                # Insertar una nueva relación en la tabla offer_applicant
                sql_associate = """
                INSERT INTO offer_applicant (id_applicant, id_offer)
                VALUES (%s, %s)
                """
                cursor.execute(sql_associate, (id_applicant, id_offer))
                self.connection.commit()
                return cursor.rowcount > 0  # Devuelve True si la fila fue insertada correctamente
        except Exception as e:
            print("Error occurred while associating applicant with offer:", e)
            self.connection.rollback()
            return False

    def delete_offer(self, id_offer):
        try:
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM offer WHERE id_offer = %s"
                cursor.execute(sql_delete, (id_offer,))
                self.connection.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print("Error occurred while deleting offer:", e)
            self.connection.rollback()
            return False

    def check_application(self, id_user, id_offer):
        try:
            with self.connection.cursor() as cursor:
                # Usar la tabla offer_applicant para verificar la relación entre el aplicante y la oferta
                sql = """
                SELECT id_applicant FROM offer_applicant
                WHERE id_applicant IN (
                    SELECT id_applicant FROM applicant WHERE id_user=%s
                ) AND id_offer=%s
                """
                cursor.execute(sql, (id_user, id_offer))
                result = cursor.fetchone()
                return bool(result)  # Retorna True si encuentra un resultado, False de lo contrario
        except Exception as e:
            print(f"Error checking application: {e}")
            return False  # O maneja más adecuadamente según tus necesidades

    def add_application(self, id_user, id_offer, start_date, finish_date):
        try:
            with self.connection.cursor() as cursor:
                sql = """
                INSERT INTO applicant (id_user, id_offer, startDate, finishDate)
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql, (id_user, id_offer, start_date, finish_date))
                self.connection.commit()
                return True  # Asume éxito si no hay excepciones
        except Exception as e:
            print(f"Error adding application: {e}")
            self.connection.rollback()
            return False

    def get_offers_by_municipality(self, municipality):
        try:
            with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT
                    o.id_offer,
                    oi.name_offer,
                    oi.start_day,
                    oi.description,
                    oi.coordinates,
                    hu.id_host_user,
                    MIN(im.image_path) AS image_path
                FROM offer o
                JOIN offer_info oi ON o.id_offer = oi.id_offer_info
                JOIN host_user hu ON o.id_host_user = hu.id_host_user
                LEFT JOIN image_offer im ON oi.id_offer_info = im.id_offer_info
                WHERE oi.municipality = %s
                GROUP BY o.id_offer
                """
                print(f"Executing SQL: {sql} with municipality: {municipality}")
                cursor.execute(sql, municipality)
                results = cursor.fetchall()
                print(f"Results fetched: {results}")

                for offer in results:
                    if offer['start_day'] and isinstance(offer['start_day'], datetime.date):
                        offer['start_day'] = offer['start_day'].strftime('%Y-%m-%d')
                    if offer['image_path']:
                        cleaned_path = offer['image_path'].replace('../backend/offer_images/', '')
                        offer['image_url'] = f"http://localhost:8000/{cleaned_path}"
                    else:
                        offer['image_url'] = None

                return results
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def update_offer(self, offer_id, labor_details, offer_details, new_images, deleted_images):
        try:
            with self.connection.cursor() as cursor:
                # Actualizar labor_conditions
                sql = """
                UPDATE labor_conditions 
                SET salary = %s, feeding = %s, workingHours = %s, workingDay = %s 
                WHERE id_labor_conditions = %s
                """
                cursor.execute(sql, (
                    labor_details['salary'],
                    labor_details['feeding'],
                    labor_details['workingHours'],
                    labor_details['workingDay'],
                    offer_id
                ))

                # Actualizar offer_info
                sql = """
                UPDATE offer_info 
                SET name_offer = %s, start_day = %s, description = %s, municipality = %s, coordinates = %s 
                WHERE id_offer_info = %s
                """
                cursor.execute(sql, (
                    offer_details['name_offer'],
                    offer_details['start_day'],
                    offer_details['description'],
                    offer_details['municipality'],
                    offer_details['coordinates'],
                    offer_id
                ))

                # Eliminar imágenes marcadas para eliminación
                if deleted_images:
                    sql = "DELETE FROM image_offer WHERE image_path IN (%s)" % ','.join(['%s'] * len(deleted_images))
                    cursor.execute(sql, tuple(deleted_images))

                # Insertar nuevas imágenes
                if new_images:
                    sql = "INSERT INTO image_offer (id_offer_info, image_path) VALUES (%s, %s)"
                    cursor.executemany(sql, [(offer_id, image) for image in new_images])

                self.connection.commit()
                return {"success": True, "message": "Oferta actualizada con éxito"}
        except Exception as e:
            self.connection.rollback()
            print(f"Error updating offer: {e}")
            return {"success": False, "message": str(e)}
        finally:
            self.connection.close()

    def __del__(self):
        self.connection.close()
