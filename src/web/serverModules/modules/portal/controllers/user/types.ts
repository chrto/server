import { UserBody as UserPatchBody } from "./updateUser/updateUser.types";

export interface UserBodyPOST extends UserPatchBody {
  email: string;
  firstName: string;
  lastName: string;
}
