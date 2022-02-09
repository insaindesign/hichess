import { Link } from "react-router-dom";

import categories from "../data/learn";

type Props = {};

function Learn(props: Props) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.key}>
          <h2>{category.name}</h2>
          <ul>
            {category.stages.map((stage) => (
              <li key={stage.key}>
                <Link to={`/learn/${category.key}/${stage.key}/`}>{stage.key}</Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default Learn;
