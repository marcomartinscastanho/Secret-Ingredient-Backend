/* eslint-disable class-methods-use-this */
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Role } from "../types/role.enum";
import { Ingredient } from "../ingredients/ingredients.model";
import { User } from "../users/user.model";
import { Action } from "./action.enum";
import { LoggedInUser } from "../types/logged-in.user";

type Subjects = InferSubjects<typeof User | typeof Ingredient> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: LoggedInUser) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    );

    switch (user.role) {
      case Role.User:
      default:
        can(Action.Create, Ingredient);
        can(Action.Read, Ingredient);
        break;
      case Role.Admin:
        can(Action.Manage, "all");
        break;
    }

    return build({
      // eslint-disable-next-line max-len
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
