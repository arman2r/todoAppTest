import { Skill } from "./skills.interface";

export interface Person {
    id?: number,
    fullName?: string,
    age?: number,
    skills?: string[],
    taskId?: number,
}
