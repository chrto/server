import { ControllerFactory } from "web/serverModules/types";
import { CurrentUserController } from "./currentUser/currentUserController.types";

export interface PortalModuleControllers {
  currentUserController: ControllerFactory<CurrentUserController>;
}
