import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftMedicine,
    fetchMedicine,
    removeMedicine, sendDraftMedicine,
    triggerUpdateMM,
    updateMedicine
} from "store/slices/medicinesSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_MedicineStatus, T_Substance} from "modules/types.ts";
import SubstanceCard from "components/SubstanceCard/SubstanceCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const MedicinePage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated} = useAppSelector((state) => state.user)

    const medicine = useAppSelector((state) => state.medicines.medicine)

    const [name, setName] = useState<string>(medicine?.name)

    const [description, setDescription] = useState<string>(medicine?.description)

    const [dose, setDose] = useState<string>(medicine?.dose)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchMedicine(id))
        return () => dispatch(removeMedicine())
    }, []);

    useEffect(() => {
        setName(medicine?.name)
        setDescription(medicine?.description)
        setDose(medicine?.dose)
    }, [medicine]);

    const sendMedicine = async (e) => {
        e.preventDefault()

        await saveMedicine()

        await dispatch(sendDraftMedicine())

        navigate("/medicines/")
    }

    const saveMedicine = async (e?) => {
        e?.preventDefault()

        const data = {
            name,
            description
        }

        await dispatch(updateMedicine(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteMedicine = async () => {
        await dispatch(deleteDraftMedicine())
        navigate("/substances/")
    }

    if (!medicine) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = medicine.status == E_MedicineStatus.Draft
    const isCompleted = medicine.status == E_MedicineStatus.Completed

    return (
        <Form onSubmit={sendMedicine} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновое лекарство" : `Лекарство №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName} disabled={!isDraft}/>
                <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription} disabled={!isDraft}/>
                {isCompleted && <CustomInput label="Дозировка (макс. приемов в день)" value={dose} disabled={true}/>}
            </Row>
            <Row>
                {medicine.substances.length > 0 ? medicine.substances.map((substance:T_Substance) => (
                    <Row key={substance.id} className="d-flex justify-content-center mb-5">
                        <SubstanceCard substance={substance} showRemoveBtn={isDraft} editMM={isDraft} />
                    </Row>
                )) :
                    <h3 className="text-center">Вещества не добавлены</h3>
                }
            </Row>
            {isDraft &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveMedicine}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteMedicine}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default MedicinePage