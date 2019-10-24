// import state from "./state.json";
import { Lens, fromTraversable, Prism } from "monocle-ts";
import { array } from "fp-ts/lib/Array";
import { Option, some } from "fp-ts/lib/Option";

interface User {
  roles: Option<Array<Role>>;
}

interface Role {
  name: RoleName;
}

type RoleName = "white" | "blue" | "red";

const user: User = { roles: some([{ name: "white" }, { name: "blue" }]) };

const roles = Lens.fromProp<User>()("roles").composePrism(
  Prism.some<Array<Role>>()
);
const roleTraversal = fromTraversable(array)<Role>();
const name = Lens.fromProp<Role>()("name");

const l = roles
  .composeTraversal(roleTraversal)
  .composeLens(name)
  .asFold();

l.getAll(user); //?
