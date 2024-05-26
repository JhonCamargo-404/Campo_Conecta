import json
import logging
import shutil
from urllib import request
import uuid
from datetime import date, timedelta, datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, UploadFile, File, status, Form, Path, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles
from MailSender import enviar_correo

import jwt
from Crud_User import UserCRUD
from CrudOffers import OfferCRUD
from Crud_User_Offer import CrudUserOffer

app = FastAPI()

app.mount("/offer_images", StaticFiles(directory="../backend/offer_images"), name="offer_images")
app.mount("/cv_storage", StaticFiles(directory="../backend/cv_storage"), name="cv_storage")

# Secret key for JWT
SECRET_KEY = "your_secret_key"

# Path for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Conexión con la base de datos
user_crud = UserCRUD('mysql://root:root@localhost:3306/campo_conectabd')
offer_crud = OfferCRUD('mysql://root:root@localhost:3306/campo_conectabd')
crud_user_offer = CrudUserOffer('mysql://root:root@localhost:3306/campo_conectabd')

# Configuración de CORS para permitir solicitudes desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE"],
    allow_headers=["*"],
)


# Modelos de datos para la creación de usuarios y otros
class UserRegistration(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    age: int


class UserLogin(BaseModel):
    email: str
    password: str


class LaborDetails(BaseModel):
    salary: int
    feeding: str
    workingHours: int
    workingDay: str


class OfferDetails(BaseModel):
    name_offer: str
    start_day: date
    description: str
    municipality: str
    coordinates: Optional[str] = None


class OfferImage(BaseModel):
    image: UploadFile


class DateRange(BaseModel):
    startDate: date
    endDate: date
    id_user: int
    id_offer: int


def get_user_id(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: email missing")

        user_id = user_crud.get_user_id_by_email(email)
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# Endpoint para el registro de usuarios
@app.post("/register/")
async def register_user(user_data: UserRegistration):
    try:
        response = user_crud.register_user(user_data.first_name, user_data.last_name, user_data.email,
                                           user_data.password, user_data.age)
        if response["success"]:
            return {"message": response["message"]}
        else:
            raise HTTPException(status_code=400, detail=response["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/registerAdmin/")
async def register_admin(user_data: UserRegistration):
    try:
        response = user_crud.register_admin(user_data.first_name, user_data.last_name, user_data.email,
                                            user_data.password, user_data.age)
        if response["success"]:
            return {"message": response["message"]}
        else:
            raise HTTPException(status_code=400, detail=response["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint para el login de usuarios
@app.post("/login/")
async def login_user(user_data: UserLogin):
    try:
        token = user_crud.login(user_data.email, user_data.password)
        if token:
            return {"access_token": token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=400, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint protegido de ejemplo
@app.get("/protected-route/")
async def protected_route(user: dict = Depends(verify_token)):
    return {"message": "You are authorized", "user": user}


@app.post("/add_offer/")
async def add_offer(labor_details: str = Form(...), offer_details: str = Form(...),
                    images: List[UploadFile] = File(...), token: str = Depends(oauth2_scheme)):
    user_id = get_user_id(token)  # Decodificar el token para obtener el user_id
    # Obtener o crear host_user
    host_user = crud_user_offer.get_or_create_host_user(user_id)
    host_user_id = host_user

    labor_details_model = LaborDetails(**json.loads(labor_details))
    offer_details_model = OfferDetails(**json.loads(offer_details))

    # Procesar y guardar las imágenes
    image_paths = save_images(images)

    try:
        offer_crud.add_offer(labor_details_model.dict(), offer_details_model.dict(), image_paths, host_user_id)
        return {"message": "Offer added successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def save_images(images: List[UploadFile]):
    image_paths = []
    for image in images:
        filename = f"{uuid.uuid4()}_{image.filename}"
        image_path = f'./offer_images/{filename}'
        with open(image_path, 'wb') as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_paths.append(image_path)
    return image_paths


@app.get("/get_users")
async def get_users():
    try:
        offers = user_crud.get_users()
        return JSONResponse(status_code=200, content=offers)
    except Exception as e:
        logging.error(f"Failed to fetch offers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete_user/{user_id}")
async def delete_user(user_id: int):
    try:
        deleted = user_crud.delete_user(user_id)
        if deleted:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_offers")
async def get_offers():
    try:
        offers = offer_crud.get_all_offers()
        return JSONResponse(status_code=200, content=offers)
    except Exception as e:
        logging.error(f"Failed to fetch offers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_user_offer/{id_user}")
async def get_offers(id_user: int):
    try:
        offers = offer_crud.get_offers_for_user(id_user)
        return JSONResponse(status_code=200, content=offers)
    except Exception as e:
        logging.error(f"Failed to fetch offers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_offer/{offer_id}")
async def get_offer(offer_id: int):
    offer_details = offer_crud.get_offer_by_id(offer_id)
    if offer_details:
        return offer_details
    else:
        raise HTTPException(status_code=404, detail="Offer not found")


@app.post("/add_offer_info/")
async def add_offer_info(name_offer: str = Form(...),
                         start_day: date = Form(...),
                         description: str = Form(...),
                         coordinates: Optional[str] = Form(None),
                         image: UploadFile = File(...)):
    try:
        # Leer los datos de la imagen
        image_data = await image.read()

        # Insertar en la base de datos
        offer_id = offer_crud.add_offer_info(name_offer, start_day, description, coordinates, image_data)
        return {"message": "Offer info added successfully", "offer_id": offer_id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.post("/submit-dates")
async def submit_dates(date_range: DateRange):
    id_applicant = offer_crud.add_applicant(date_range.id_user, date_range.startDate, date_range.endDate)
    if not id_applicant:
        raise HTTPException(status_code=400, detail="Failed to create applicant")

    success = offer_crud.associate_applicant_with_offer(id_applicant, date_range.id_offer)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to associate applicant with offer")

    return {"message": "Applicant created and associated with offer successfully"}


@app.get("/disabled_dates/{id_offer}", response_model=List[date])
def get_disabled_dates(id_offer: int = Path(...)):
    applicants = offer_crud.get_disabled_dates(id_offer)
    if not applicants:
        raise HTTPException(status_code=404, detail="No dates found")

    disabled_dates = []
    for applicant in applicants:
        current_date = applicant['startDate']
        while current_date <= applicant['finishDate']:
            disabled_dates.append(current_date)
            current_date += timedelta(days=1)
    return disabled_dates


@app.delete("/delete_offer/{id_offer}")
async def delete_offer(id_offer: int):
    try:
        success = offer_crud.delete_offer(id_offer)
        if not success:
            raise HTTPException(status_code=404, detail="Offer not found")
        return {"message": "Offer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_applicants/{id_offer}")
async def get_applicants(id_offer: int):
    try:
        applicants = crud_user_offer.get_applicants_for_offer(id_offer)
        return JSONResponse(status_code=200, content=applicants)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Verificar si el usuario ya ha aplicado a una oferta
@app.get("/has_applied/{id_user}/{id_offer}")
async def has_applied(id_user: int, id_offer: int):
    application_exists = offer_crud.check_application(id_user, id_offer)
    return {"has_applied": application_exists}


# Obtener el CV de un usuario
@app.get("/get_cv/{user_id}")
async def get_cv(user_id: int):
    cv_path = user_crud.get_cv(user_id)
    if cv_path:
        return {"cv": cv_path}
    else:
        raise HTTPException(status_code=404, detail="CV not found")


# Cargar el CV de un usuario
@app.post("/upload_cv/{user_id}")
async def upload_cv(user_id: int, file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = f"../backend/cv_storage/{filename}"
    with open(path, 'wb') as buffer:
        buffer.write(await file.read())
    success = user_crud.update_cv_path(user_id, path)
    if success:
        return {"message": "CV uploaded successfully", "path": path}
    else:
        raise HTTPException(status_code=500, detail="Failed to upload CV")


@app.get("/get_applications/{id_user}")
async def get_applications(id_user: int):
    try:
        applications = crud_user_offer.get_user_applications(id_user)
        if applications is None:
            raise HTTPException(status_code=404, detail="No applications found")
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/accept_applicant/{id_applicant}")
async def accept_applicant(id_applicant: int):
    return crud_user_offer.update_applicant_status(id_applicant, "aceptado")


@app.post("/reject_applicant/{id_applicant}")
async def reject_applicant(id_applicant: int):
    return crud_user_offer.update_applicant_status(id_applicant, "rechazado")

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str
class PasswordResetRequest(BaseModel):
    email: EmailStr

@app.post("/forgot-password/")
async def forgot_password(request: PasswordResetRequest):
    email = request.email
    user_exists = user_crud.get_user_id_by_email(email)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    asunto = "Cambio de contraseña"
    contenido_html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cambio de contraseña</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
                background-color: #4CAF50;
                color: white;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                padding: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                font-size: 16px;
                color: white;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #777777;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Cambio de Contraseña</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para cambiar su contraseña. Haga clic en el siguiente enlace para proceder:</p>
                <a href="http://localhost:3000/NewPassword" class="button">Cambiar contraseña</a>
                <p>Si no solicitó este cambio, por favor ignore este correo.</p>
            </div>
            <div class="footer">
                <p>© 2024 CampoConecta. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Enviar el correo electrónico utilizando la función de mailsender
    resultado = enviar_correo(email, asunto, contenido_html)
    
    if resultado['status_code'] is None:
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {resultado['error']}")
    
    return {"message": "Correo de recuperación enviado"}

@app.post("/reset-password/")
async def reset_password(reset_data: PasswordReset):
    try:
        email = reset_data.email
        new_password = reset_data.new_password

        # Llama al método update_password del CRUD de usuario
        user_crud.update_password(email, new_password)
        
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_offers-by-municipality/{municipality}")
async def get_offers_by_municipality(municipality: str):
    try:
        if municipality.lower() == "todos":
            offers = offer_crud.get_all_offers()
        else:
            offers = offer_crud.get_offers_by_municipality(municipality)
        if not offers:
            raise HTTPException(status_code=404, detail=f"No offers found for municipality: {municipality}")
        return offers
    except Exception as e:
        logging.error(f"Failed to fetch offers for municipality {municipality}: {e}")
        raise HTTPException(status_code=500, detail=str(e))



