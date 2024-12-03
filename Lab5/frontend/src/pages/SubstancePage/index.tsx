import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Substance} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {SubstanceMocks} from "src/modules/mocks.ts";
import mockImage from "assets/mock.png";

type Props = {
    selectedSubstance: T_Substance | null,
    setSelectedSubstance: React.Dispatch<React.SetStateAction<T_Substance | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const SubstancePage = ({selectedSubstance, setSelectedSubstance, isMock, setIsMock}: Props) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/substances/${id}`)
            const data = await response.json()
            setSelectedSubstance(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedSubstance(SubstanceMocks.find(substance => substance?.id == parseInt(id as string)) as T_Substance)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedSubstance(null)
    }, []);

    if (!selectedSubstance) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={isMock ? mockImage as string : selectedSubstance.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedSubstance.name}</h1>
                    <p className="fs-5">Описание: {selectedSubstance.description}</p>
                    <p className="fs-5">Порядковый номер: {selectedSubstance.number}.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default SubstancePage