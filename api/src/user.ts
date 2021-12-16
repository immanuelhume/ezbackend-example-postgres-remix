import { EzUser } from "@ezbackend/auth";
import { Type } from "@ezbackend/common";

export const User = new EzUser("user", ["google"], {
  pastes: {
    type: Type.ONE_TO_MANY,
    target: "paste",
    inverseSide: "user",
    onDelete: "NO ACTION",
    nullable: true,
  },
});

User.get("/me", async (req) => {
  return { user: req.user };
});
