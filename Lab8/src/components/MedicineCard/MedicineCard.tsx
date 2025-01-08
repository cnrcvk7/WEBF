import {Button, Card, Col, Row} from "reactstrap";
import {E_MedicineStatus, T_Medicine} from "modules/types.ts";
import {formatDate} from "utils/utils.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {acceptMedicine, fetchMedicines, rejectMedicine} from "store/slices/medicinesSlice.ts";

type Props = {
    medicine: T_Medicine
    index: number
}

const MedicineCard = ({medicine, index}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptMedicine = async (medicine_id) => {
        await dispatch(acceptMedicine(medicine_id))
        await dispatch(fetchMedicines())
    }

    const handleRejectMedicine = async (medicine_id) => {
        await dispatch(rejectMedicine(medicine_id))
        await dispatch(fetchMedicines())
    }

    const navigate = useNavigate()

    const openMedicinePage = () => {
        navigate(`/medicines/${medicine.id}`)
    }

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[medicine.status]}
                </Col>
                <Col md={2}>
                    {medicine.dose}
                </Col>
                <Col>
                    {formatDate(medicine.date_created)}
                </Col>
                <Col>
                    {formatDate(medicine.date_formation)}
                </Col>
                <Col>
                    {formatDate(medicine.date_complete)}
                </Col>
                {!is_superuser &&
                    <Col>
                        <Button color="primary" onClick={openMedicinePage}>Открыть</Button>
                    </Col>
                }
                {is_superuser &&
                    <>
                        <Col>
                            {medicine.owner}
                        </Col>
                        <Col>
                            {medicine.status == E_MedicineStatus.InWork && <Button color="primary" onClick={() => handleAcceptMedicine(medicine.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {medicine.status == E_MedicineStatus.InWork && <Button color="danger" onClick={() => handleRejectMedicine(medicine.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default MedicineCard