import { EzModel, Type } from "@ezbackend/common";
import type { FastifyRequest } from "fastify";

export const Paste = new EzModel("paste", {
  content: Type.VARCHAR,
  createdAt: {
    type: Type.DATE,
    createDate: true,
  },
  user: {
    type: Type.MANY_TO_ONE,
    target: "user",
    inverseSide: "pastes",
    joinColumn: true,
    onDelete: "SET NULL",
    nullable: true,
  },
  userId: {
    type: Type.INT,
    nullable: true,
  },
});

type GetPasteWithLimitRequest = FastifyRequest<{
  Querystring: { limit: number };
}>;

Paste.get("/latest", {
  schema: {
    querystring: {
      limit: { type: "number" },
    },
  },
  handler: (request: GetPasteWithLimitRequest) => {
    const { limit } = request.query;
    const repo = Paste.getRepo();
    return repo.find({ take: limit, order: { id: "DESC" } });
  },
});

type GetPasteForMeRequest = FastifyRequest<{ Querystring: { limit: number } }>;

Paste.get("/me", {
  schema: {
    querystring: {
      limit: { type: "number" },
    },
  },
  handler: (request: GetPasteForMeRequest, reply) => {
    // @ts-ignore
    const user = request.user;
    const { limit } = request.query;
    if (!user) {
      reply.code(401);
      throw new Error("unauthenticated");
    }
    const repo = Paste.getRepo();
    return repo.find({
      where: { userId: user.id },
      take: limit,
      order: { id: "DESC" },
    });
  },
});
