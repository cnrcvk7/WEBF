import {useAppSelector} from "store/store.ts";
import {Card, Col, Row} from "reactstrap";
import MedicineCard from "components/MedicineCard/MedicineCard.tsx";
import {T_Medicine} from "modules/types.ts";
import "./MedicineTable.css"

type Props = {
    medicines:T_Medicine[]
}

const MedicinesTable = ({medicines}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    return (
        <div className="mb-5">
            <div className="mb-2" style={{fontWeight: "bold"}}>
                <Card style={{padding: "10px"}}>
                    <Row>
                        <Col md={1}>
                            №
                        </Col>
                        <Col md={1}>
                            Статус
                        </Col>
                        <Col md={2}>
                            Дозировка
                        </Col>
                        <Col>
                            Дата создания
                        </Col>
                        <Col>
                            Дата формирования
                        </Col>
                        <Col>
                            Дата завершения
                        </Col>
                        {!is_superuser &&
                            <Col>
                                Действие
                            </Col>
                        }
                        {is_superuser &&
                            <>
                                <Col>
                                    Пользователь
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                            </>
                        }
                    </Row>
                </Card>
            </div>
            <div className="d-flex flex-column gap-2">
                {medicines.map((medicine, index) => (
                    <MedicineCard medicine={medicine} index={index} key={index}/>
                ))}
            </div>
        </div>
    )
};

export default MedicinesTable