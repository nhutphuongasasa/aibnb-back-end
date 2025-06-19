import { PrismaClient } from "@prisma/client";
import { ICommandRepository, IQueryRepository, IRepository } from "../interface";
import prisma from "../lib/prismaDB";

type ModelNames = keyof PrismaClient;

type PrismaDelegate = {
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any[]>;
  create: (args: any) => Promise<any>;
};

export abstract class BaseRepository<Entity, Cond> implements IRepository<Entity, Cond>{
    constructor(
        readonly queryRepo: IQueryRepository<Entity, Cond>,
        readonly commandRepo: ICommandRepository<Entity>
    ) {}

    async GetById(id: string): Promise<Entity | null> {
        return await this.queryRepo.GetById(id);
    }

    async FindListByCond(cond: Cond): Promise<Entity[]> {
        return await this.queryRepo.FindListByCond(cond);
    }

    async FindOneByCond(cond: Cond): Promise<Entity | null> {
        return await this.queryRepo.FindOneByCond(cond);
    }

    async Create(data: Entity): Promise<Entity> {
        return await this.commandRepo.Create(data)
    }
}

export abstract class BaseQueryRepository<Entity, Cond> implements IQueryRepository<Entity, Cond> {
  constructor(readonly modelName: ModelNames) {}

  async GetById(id: string): Promise<Entity | null> {
    return await (prisma[this.modelName] as PrismaDelegate).findUnique({ where: { id } });
  }

  async FindListByCond(cond: Cond): Promise<Entity[]> {
    return await (prisma[this.modelName] as PrismaDelegate).findMany({
      where: cond as any,
    });
  }

  async FindOneByCond(cond: Cond): Promise<Entity | null> {
    return await (prisma[this.modelName] as PrismaDelegate).findFirst({
      where: cond as any,
    });
  }
}

export abstract class BaseCommandRepository<Entity> implements ICommandRepository<Entity> {
    constructor(readonly modelName: ModelNames) {}
    
    async Create(data: Entity): Promise<Entity> {
      const created = await (prisma[this.modelName] as PrismaDelegate).create({
        data,
        });

        // if ((created as any)._id && !(created as any).id) {
        //   (created as any).id = (created as any)._id.toString();
        // }
      
        return created;
    }
}