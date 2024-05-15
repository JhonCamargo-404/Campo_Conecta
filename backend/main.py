import json
import uuid
from datetime import date, timedelta
from typing import Optional, List

from fastapi import FastAPI, HTTPException, UploadFile, File, status, Form, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles

from Crud_User import UserCRUD
from CrudOffers import OfferCRUD

app = FastAPI()

app.mount("/offer_images", StaticFiles(directory="../backend/offer_images"), name="offer_images")

# Conexión con la base de datos
user_crud = UserCRUD('mysql://root:root@localhost:3306/campo_conectabd')
offer_crud = OfferCRUD('mysql://root:root@localhost:3306/campo_conectabd')

# Configuración de CORS para permitir solicitudes desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Modelo de datos para la creación de usuarios
class UserRegistration(BaseModel):
    first_name: str
    last_name: str
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
    coordinates: Optional[str] = None


class OfferImage(BaseModel):
    image: UploadFile


class DateRange(BaseModel):
    startDate: date
    endDate: date
    id_user: int
    id_offer: int


# Endpoint para el registro de usuarios
@app.post("/register/")
async def register_user(user_data: UserRegistration):
    try:
        response = user_crud.register_user(user_data.first_name, user_data.last_name, user_data.email,
                                           user_data.password)
        if response["success"]:
            return {"message": response["message"]}
        else:
            raise HTTPException(status_code=400, detail=response["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add_offer/")
async def add_offer(labor_details: str = Form(...), offer_details: str = Form(...),
                    host_user_id: int = Form(...), images: List[UploadFile] = File(...)):
    try:
        # Convertir las cadenas JSON a modelos Pydantic
        labor_details_model = LaborDetails(**json.loads(labor_details))
        offer_details_model = OfferDetails(**json.loads(offer_details))

        # Guardar la imagen en el sistema de archivos
        image_paths = []
        for image in images:
            # Generar un nombre de archivo único
            filename = f"{uuid.uuid4()}_{image.filename}"
            image_path = f'../backend/offer_images/{filename}'

            # Guardar la imagen
            with open(image_path, 'wb') as buffer:
                image_content = await image.read()
                buffer.write(image_content)
            image_paths.append(image_path)

        # Añadir la oferta utilizando el método CRUD
        offer_crud.add_offer(labor_details_model.dict(), offer_details_model.dict(), image_paths, host_user_id)
        return {"message": "Offer added successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.get("/get_offers")
async def get_offers():
    try:
        offers = offer_crud.get_all_offers()
        return JSONResponse(status_code=200, content=offers)
    except Exception as e:
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
