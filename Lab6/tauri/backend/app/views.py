import random

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


def get_draft_medicine():
    return Medicine.objects.filter(status=1).first()


def get_user():
    return User.objects.filter(is_superuser=False).first()


def get_moderator():
    return User.objects.filter(is_superuser=True).first()


@api_view(["GET"])
def search_substances(request):
    substance_name = request.GET.get("substance_name", "")

    substances = Substance.objects.filter(status=1)

    if substance_name:
        substances = substances.filter(name__icontains=substance_name)

    serializer = SubstancesSerializer(substances, many=True)
    
    draft_medicine = get_draft_medicine()

    resp = {
        "substances": serializer.data,
        "substances_count": SubstanceMedicine.objects.filter(medicine=draft_medicine).count() if draft_medicine else None,
        "draft_medicine": draft_medicine.pk if draft_medicine else None
    }

    return Response(resp)


@api_view(["GET"])
def get_substance_by_id(request, substance_id):
    if not Substance.objects.filter(pk=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    substance = Substance.objects.get(pk=substance_id)
    serializer = SubstanceSerializer(substance)

    return Response(serializer.data)


@api_view(["PUT"])
def update_substance(request, substance_id):
    if not Substance.objects.filter(pk=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    substance = Substance.objects.get(pk=substance_id)

    serializer = SubstanceSerializer(substance, data=request.data, partial=True)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def create_substance(request):
    serializer = SubstanceSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Substance.objects.create(**serializer.validated_data)

    substances = Substance.objects.filter(status=1)
    serializer = SubstanceSerializer(substances, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_substance(request, substance_id):
    if not Substance.objects.filter(pk=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    substance = Substance.objects.get(pk=substance_id)
    substance.status = 2
    substance.save()

    substances = Substance.objects.filter(status=1)
    serializer = SubstanceSerializer(substances, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def add_substance_to_medicine(request, substance_id):
    if not Substance.objects.filter(pk=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    substance = Substance.objects.get(pk=substance_id)

    draft_medicine = get_draft_medicine()

    if draft_medicine is None:
        draft_medicine = Medicine.objects.create()
        draft_medicine.owner = get_user()
        draft_medicine.date_created = timezone.now()
        draft_medicine.save()

    if SubstanceMedicine.objects.filter(medicine=draft_medicine, substance=substance).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    item = SubstanceMedicine.objects.create()
    item.medicine = draft_medicine
    item.substance = substance
    item.save()

    serializer = MedicineSerializer(draft_medicine)
    return Response(serializer.data["substances"])


@api_view(["POST"])
def update_substance_image(request, substance_id):
    if not Substance.objects.filter(pk=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    substance = Substance.objects.get(pk=substance_id)

    image = request.data.get("image")
    if image is not None:
        substance.image = image
        substance.save()

    serializer = SubstanceSerializer(substance)

    return Response(serializer.data)


@api_view(["GET"])
def search_medicines(request):
    status = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    medicines = Medicine.objects.exclude(status__in=[1, 5])

    if status > 0:
        medicines = medicines.filter(status=status)

    if date_formation_start and parse_datetime(date_formation_start):
        medicines = medicines.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        medicines = medicines.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = MedicinesSerializer(medicines, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_medicine_by_id(request, medicine_id):
    if not Medicine.objects.filter(pk=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    medicine = Medicine.objects.get(pk=medicine_id)
    serializer = MedicineSerializer(medicine, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_medicine(request, medicine_id):
    if not Medicine.objects.filter(pk=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    medicine = Medicine.objects.get(pk=medicine_id)
    serializer = MedicineSerializer(medicine, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_user(request, medicine_id):
    if not Medicine.objects.filter(pk=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    medicine = Medicine.objects.get(pk=medicine_id)

    if medicine.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    medicine.status = 2
    medicine.date_formation = timezone.now()
    medicine.save()

    serializer = MedicineSerializer(medicine, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_admin(request, medicine_id):
    if not Medicine.objects.filter(pk=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    medicine = Medicine.objects.get(pk=medicine_id)

    if medicine.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        medicine.dose = random.randint(1, 3)

    medicine.date_complete = timezone.now()
    medicine.status = request_status
    medicine.moderator = get_moderator()
    medicine.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_medicine(request, medicine_id):
    if not Medicine.objects.filter(pk=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    medicine = Medicine.objects.get(pk=medicine_id)

    if medicine.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    medicine.status = 5
    medicine.save()

    serializer = MedicineSerializer(medicine, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_substance_from_medicine(request, medicine_id, substance_id):
    if not SubstanceMedicine.objects.filter(medicine_id=medicine_id, substance_id=substance_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SubstanceMedicine.objects.get(medicine_id=medicine_id, substance_id=substance_id)
    item.delete()

    items = SubstanceMedicine.objects.filter(medicine_id=medicine_id)
    data = [SubstanceItemSerializer(item.substance, context={"weight": item.weight}).data for item in items]

    return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_substance_in_medicine(request, medicine_id, substance_id):
    if not SubstanceMedicine.objects.filter(substance_id=substance_id, medicine_id=medicine_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SubstanceMedicine.objects.get(substance_id=substance_id, medicine_id=medicine_id)

    serializer = SubstanceMedicineSerializer(item, data=request.data,  partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = User.objects.get(pk=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    return Response(serializer.data)