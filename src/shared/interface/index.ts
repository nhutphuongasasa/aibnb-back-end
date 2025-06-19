export interface IRepository<Entity, Cond> extends IQueryRepository<Entity, Cond>, ICommandRepository<Entity> {}

export interface IQueryRepository<Entity, Cond> {
    GetById(id: string): Promise<Entity | null>;
    FindListByCond(cond: Cond | any): Promise<Entity[]>;
    FindOneByCond(cond: Cond): Promise<Entity | null>;
}

export interface ICommandRepository<Entity>{
    Create(data: Entity): Promise<Entity>;
}

export interface IUseCase<CreateDTO, Cond, Response>{
    create(data: CreateDTO): Promise<any>,
    getDetail(id: string): Promise<Response | null>,
    getList(cond: Cond): Promise<Response[] | null>,
}