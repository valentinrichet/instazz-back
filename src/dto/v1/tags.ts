import { body, ValidationChain } from "express-validator";
import { ITag } from "../../models/v1/tags";

export class TagDto {
    public id: ITag["_id"];
    public name: ITag["name"];

    public constructor(tag: ITag) {
        this.id = tag?._id;
        this.name = tag?.name;
    }
}

export class CreationTagDto {
    public name: ITag["name"];

    public constructor(tag: any) {
        this.name = tag?.name;
    }
}

export class UpdateTagDto {
    public name: ITag["name"];

    public constructor(tag: any) {
        this.name = tag?.name;
    }
}

export function tagCreationAndUpdateDtoRules(): ValidationChain[] {
    return [
        body("name", "Name is missing").notEmpty()
    ];
}