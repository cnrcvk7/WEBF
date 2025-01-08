import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteSubstance,
    fetchSubstance,
    removeSelectedSubstance,
    updateSubstance,
    updateSubstanceImage
} from "store/slices/substancesSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const SubstanceEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {substance} = useAppSelector((state) => state.substances)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(substance?.name)

    const [description, setDescription] = useState<string>(substance?.description)

    const [number, setNumber] = useState<number>(substance?.number)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(substance?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveSubstance = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateSubstanceImage({
                substance_id: substance.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            number
        }

        await dispatch(updateSubstance({
            substance_id: substance.id,
            data
        }))

        navigate("/substances-table/")
    }

    useEffect(() => {
        dispatch(fetchSubstance(id))
        return () => dispatch(removeSelectedSubstance())
    }, []);

    useEffect(() => {
        setName(substance?.name)
        setDescription(substance?.description)
        setNumber(substance?.number)
        setImgURL(substance?.image)
    }, [substance]);

    const handleDeleteSubstance = async () => {
        await dispatch(deleteSubstance(id))
        navigate("/substances-table/")
    }

    if (!substance) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput label="Порядковый номер" placeholder="Введите порядковый номер" type="number" value={number} setValue={setNumber}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={saveSubstance}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteSubstance}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default SubstanceEditPage