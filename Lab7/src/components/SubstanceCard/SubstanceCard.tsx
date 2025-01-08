import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Substance} from "modules/types.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addSubstanceToMedicine, fetchSubstances} from "store/slices/substancesSlice.ts";
import {removeSubstanceFromDraftMedicine, updateSubstanceValue} from "store/slices/medicinesSlice.ts";

type Props = {
    substance: T_Substance,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean,
}

const SubstanceCard = ({substance,  showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.medicines)

    const [local_weight, setLocal_weight] = useState(substance.weight)
    
    const location = useLocation()

    const isMedicinePage = location.pathname.includes("medicines")

    const handeAddToDraftMedicine = async () => {
        await dispatch(addSubstanceToMedicine(substance.id))
        await dispatch(fetchSubstances())
    }

    const handleRemoveFromDraftMedicine = async () => {
        await dispatch(removeSubstanceFromDraftMedicine(substance.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateSubstanceValue({
            substance_id: substance.id,
            weight: local_weight
        }))
    }

    if (isMedicinePage) {
        return (
            <Card key={substance.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={substance.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {substance.name}
                            </CardTitle>
                            <CardText>
                                Порядковый номер: {substance.number} 
                            </CardText>
                            <CustomInput label="Вес" type="number" value={local_weight} setValue={setLocal_weight} disabled={!editMM || is_superuser} className={"w-25"}/>
                            <Col className="d-flex gap-5">
                                <Link to={`/substances/${substance.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftMedicine}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card key={substance.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={substance.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {substance.name}
                </CardTitle>
                <CardText>
                    Порядковый номер: {substance.number} 
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/substances/${substance.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftMedicine}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default SubstanceCard