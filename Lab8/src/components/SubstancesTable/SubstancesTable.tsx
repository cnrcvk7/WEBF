import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Substance} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteSubstance} from "store/slices/substancesSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    substances:T_Substance[]
}

const SubstancesTable = ({substances}:Props) => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (substance_id) => {
        navigate(`/substances/${substance_id}`)
    }

    const openpRroductEditPage = (substance_id) => {
        navigate(`/substances/${substance_id}/edit`)
    }

    const handleDeleteSubstance = async (substance_id) => {
        dispatch(deleteSubstance(substance_id))
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Название',
                accessor: 'name',
                Cell: ({ value }) => value
            },
            {
                Header: 'Порядковый номер',
                accessor: 'number',
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "edit_button",
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => openpRroductEditPage(cell.row.values.id)}>Редактировать</Button>
                )
            },
            {
                Header: "Удалить",
                accessor: "delete_button",
                Cell: ({ cell }) => (
                    <Button color="danger" onClick={() => handleDeleteSubstance(cell.row.values.id)}>Удалить</Button>
                )
            }
        ],
        []
    )

    if (!substances.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={substances} onClick={handleClick} />
    )
};

export default SubstancesTable