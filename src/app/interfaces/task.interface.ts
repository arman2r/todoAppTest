import { Person } from "./person.interface";

export interface Paginate {
    totalCount: number,
    page: number,
    limit: number,
    tasks: Task[]
}

export interface Task {
    taskId?: number,
    title?: string,
    deadLine?: Date,
    persons?: Person[]
}