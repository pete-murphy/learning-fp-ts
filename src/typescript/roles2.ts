// import state from "./state.json";
import { Lens, fromTraversable, Prism, Optional } from "monocle-ts";
import { array } from "fp-ts/lib/Array";
import { some } from "fp-ts/lib/Option";

interface User {
  roles: Array<Role>;
}

interface Role {
  name?: RoleName;
}

type RoleName = "white" | "blue" | "red";

const user: User = { roles: [{ name: "white" }, { name: "blue" }] };

const roles = Lens.fromProp<User>()("roles");
const roleTraversal = fromTraversable(array)<Role>();
const names = Optional.fromNullableProp<Role>()("name").asFold();

const l = roles.composeTraversal(roleTraversal).composeFold(names);

l.getAll(user); //?
