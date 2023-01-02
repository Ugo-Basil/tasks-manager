import { objectType, extendType, stringArg, nonNull, intArg } from "nexus";
import { User } from "./User";

export const Task = objectType({
  name: "Task",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("description");
    t.string("status");
    t.list.field("users", {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.task
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .users();
      },
    });
  },
});

export const TaskQuery = extendType({
  type: "Query",
    definition(t) {
      
    //get all tasks
    t.nonNull.list.field("tasks", {
      type: Task,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.task.findMany();
      },
    });
      
    //get task by id
    t.field("task", {
      type: Task,
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        return await ctx.prisma.task.findUnique({
          where: {
            userId: args.userId,
          },
        });
      },
    });
  },
});

export const TaskMutation = extendType({
    type: "Mutation",
    definition(t) {
        // create task
        t.nonNull.field("createTask", {
            type: Task,
            args: {
                id: stringArg(),
                title: nonNull(stringArg()),
                description: nonNull(stringArg()),
                userId: stringArg(),

                status: nonNull(stringArg()),
            },
            async resolve(_root, args, ctx) {
                return await ctx.prisma.task.create({
                    data: {
                        id: args.id,
                        title: args.title,
                        description: args.description,
                        status: args.status,
                        userId: args.userId,
                    },
                });
            },

        });

        // update task by id
        t.field("updateTask", {
            type: Task,
            args: {
                id: nonNull(stringArg()),
                title: stringArg(),
                description: stringArg(),
                userId: stringArg(),
                status: stringArg(),
            },
            async resolve(_root, args, ctx) {
                return await ctx.prisma.task.update({
                    where: {
                        id: args.id,
                    },

                    data: {
                        title: args.title,
                        description: args.description,
                        status: args.status,
                        userId: args.userId,
                    },
                });
            },
        });
        //delete task by id
        t.field("deleteTask", {
            type: Task,
            args: {
                id: nonNull(stringArg()),
            },
            async resolve(_root, args, ctx) {
                return await ctx.prisma.task.delete({
                    where: {
                        id: args.id,
                    },
                });
            },
        });
    },
});