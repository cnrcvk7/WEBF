import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Substance} from "modules/types.ts";

type Props = {
    selectedSubstance: T_Substance | null
}

const Breadcrumbs = ({selectedSubstance}:Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/substances") &&
                <BreadcrumbItem active>
                    <Link to="/substances">
						Вещества
                    </Link>
                </BreadcrumbItem>
			}
            {selectedSubstance &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedSubstance.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs