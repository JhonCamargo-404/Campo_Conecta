import pytest
import json
from httpx import AsyncClient, ASGITransport
from main import app
from fastapi import FastAPI

BASE_URL = "http://localhost:8000"
TEST_IMAGE_PATH = "C:/Users/edwin/OneDrive/Escritorio/testCarpeta/testimage.jpeg"


@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        response = await ac.post("/register/", json={
            "first_name": "Edwin",
            "last_name": "Becerra",
            "email": "edwincamilo59@gmail.com",
            "password": "test1password1",
            "age": 25
        })
    assert response.status_code == 200
    assert response.json() == {"message": "Usuario registrado con éxito"}


@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        response = await ac.post("/login/", json={
            "email": "testuser1@example.com",
            "password": "test1password1"
        })
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_add_offer():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        # Simular inicio de sesión del usuario para obtener un token
        login_response = await ac.post("/login/", json={
            "email": "edwincamilo59@gmail.com",
            "password": "test1password1"
        })
        token = login_response.json()["access_token"]

        # Cargar la imagen de prueba
        with open(TEST_IMAGE_PATH, "rb") as image_file:
            # Añadir una oferta con los detalles y la ruta de la imagen
            response = await ac.post("/add_offer/",
                                     data={
                                         "labor_details": json.dumps({
                                             "salary": 2345,
                                             "feeding": "si",
                                             "workingHours": 5,
                                             "workingDay": ""
                                         }),
                                         "offer_details": json.dumps({
                                             "name_offer": "EDWIN SEGUNDA OFERTA",
                                             "start_day": "2024-05-27",
                                             "description": "Test Description SEGUNDA OFERTA",
                                             "municipality": "PAIPA",
                                             "coordinates": "5.784464, -73.115976"
                                         }),
                                     },
                                     files={"images": ("firma.jpg", image_file, "image/jpeg")},
                                     headers={"Authorization": f"Bearer {token}"}
                                     )

    assert response.status_code == 200
    assert response.json() == {"message": "Offer added successfully"}


@pytest.mark.asyncio
async def test_get_offers():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        response = await ac.get("/get_offers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)



@pytest.mark.asyncio
async def test_delete_offer():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        # Asumiendo que hay una oferta con id 1
        response = await ac.delete("/delete_offer/1")
    assert response.status_code == 200
    assert response.json() == {"message": "Offer deleted successfully"}


@pytest.mark.asyncio
async def test_reset_password():
    async with AsyncClient(transport=ASGITransport(app), base_url=BASE_URL) as ac:
        response = await ac.post("/reset-password/", json={
            "email": "testuser1@example.com",
            "new_password": "newpassword1"
        })
    assert response.status_code == 200
    assert response.json() == {"message": "Password updated successfully"}
