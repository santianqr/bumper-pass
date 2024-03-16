import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { hash, compare } from "bcrypt";
import { NextResponse } from "next/server";
import { EmailVerify } from "@/components/email-verify";
import { EmailForgotPassword } from "@/components/email-forgot-password";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const FormSchemaRegister = z
  .object({
    email: z.string({ required_error: "Please type a valid email." }).email(),
    password: z
      .string()
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(
            value,
          ),
        {
          message:
            "Password must have 8 characters, one mayus, one symbol and one number.",
        },
      ),
    name: z.string().min(2, { message: "Type at least 2 characters." }),
    state: z.string({ required_error: "Please select a valid option." }),
    unit: z.string().optional(),
    vin: z
      .string({ required_error: "Must be just numbers." })
      .min(3, { message: "Type just 3 numbers." })
      .max(3, { message: "Type just 3 numbers." }),
    phone: z.string().optional(),
    confirmPassword: z.string(),
    middleName: z.string().optional(),
    city: z.string().min(2, { message: "Type at least 2 characters." }),
    zipCode: z
      .string()
      .refine((value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value), {
        message: "Must be a valid zip code on USA.",
      }),
    currentPlate: z
      .string()
      .min(2, { message: "Type at least 2 characters." })
      .max(7, { message: "Type at most 7 characters." }),
    lastName: z.string().min(2, { message: "Type at least 2 characters." }),
    street: z.string().min(2, { message: "Type at least 2 characters." }),
    terms: z.boolean().default(false),
    suscribe: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "Please accept the terms and conditions.",
    path: ["terms"],
  });

const FormSchemaAccount = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  state: z.string(),
  phone: z.string().optional(),
  city: z.string().min(2),
  zipCode: z
    .string()
    .refine((value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value))
    .optional(),
  currentPlate: z.string().min(2).max(7),
  street: z.string().min(2),
});

const FormSchemaResetPassword = z
  .object({
    currentPassword: z
      .string()
      .refine((value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(
          value,
        ),
      ),
    newPassword: z
      .string()
      .refine((value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(
          value,
        ),
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
  });

const FormSchemaSuscribe = z.object({
  suscribe: z.boolean(),
});

const FormSchemaForgotPassword = z.object({
  email: z.string().email(),
});

const FormSchemaUpdatePassword = z.object({
  password: z
    .string()
    .refine((value) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(value),
    ),
  token: z.string(),
});

export const funcRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(FormSchemaRegister)
    .mutation(async ({ ctx, input }) => {
      try {
        const data_user = FormSchemaRegister.parse(input);
        const resend = new Resend(process.env.RESEND_API_KEY);

        const existingEmail = await ctx.db.user.findUnique({
          where: { email: data_user.email },
        });
        if (existingEmail) {
          return NextResponse.json({
            user: null,
            message: "Email already exists.",
            status: 409,
          });
        }

        const existingPlate = await ctx.db.user.findUnique({
          where: { currentPlate: data_user.currentPlate },
        });
        if (existingPlate) {
          return NextResponse.json({
            user: null,
            message: "Plate already exists.",
            status: 409,
          });
        }

        const existingVin = await ctx.db.user.findUnique({
          where: { vin: data_user.vin },
        });
        if (existingVin) {
          return NextResponse.json({
            user: null,
            message: "VIN already exists.",
            status: 409,
          });
        }

        const hashedPassword = await hash(data_user.password, 10);
        const token = randomBytes(32).toString("base64url");
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const { data, error } = await resend.emails.send({
          from: "Bumperpass Contact <contact@bumperpass.com>",
          to: data_user.email,
          subject: "Email verification.",
          text: "Email verification.",
          react: EmailVerify({ name: data_user.name, token: token }),
        });

        if (error) {
          console.error(error);
        }

        console.log(data);

        return ctx.db.user.create({
          data: {
            name: data_user.name,
            email: data_user.email,
            password: hashedPassword,
            middleName: data_user.middleName,
            lastName: data_user.lastName,
            phone: data_user.phone,
            city: data_user.city,
            zipCode: data_user.zipCode,
            currentPlate: data_user.currentPlate,
            vin: data_user.vin,
            state: data_user.state,
            street: data_user.street,
            unit: data_user.unit,
            suscribe: data_user.suscribe,
            tokens: {
              create: {
                token: token,
                expires: expiryDate,
              },
            },
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  resetPassword: protectedProcedure
    .input(FormSchemaResetPassword)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = FormSchemaResetPassword.parse(input);

        const person = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        });
        if (!person) {
          return NextResponse.json({
            user: null,
            message: "Person doesnt exists.",
            status: 409,
          });
        }

        if (person.password !== null) {
          const passwordMatch = await compare(
            data.currentPassword,
            person.password,
          );
          if (!passwordMatch) {
            return NextResponse.json({
              user: null,
              message: "Passwords not matched.",
              status: 409,
            });
          }
        }

        const hashedPassword = await hash(data.newPassword, 10);

        const updateData = {
          password: hashedPassword,
        };

        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: updateData,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  updateSuscribe: protectedProcedure
    .input(FormSchemaSuscribe)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = FormSchemaSuscribe.parse(input);

        const person = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        });
        if (!person) {
          return NextResponse.json({
            user: null,
            message: "Person doesnt exists.",
            status: 409,
          });
        }

        const updateData = {
          suscribe: data.suscribe,
        };

        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: updateData,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  getSuscribe: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        suscribe: true,
      },
    });
  }),

  getPlates: protectedProcedure.query(({ ctx }) => {
    return ctx.db.customPlate.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        plate: true,
      },
    });
  }),

  getAccount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        state: true,
        city: true,
        street: true,
        zipCode: true,
        currentPlate: true,
      },
    });
  }),

  getSearch: protectedProcedure.query(({ ctx }) => {
    return ctx.db.plate.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        plate: true,
        available: true,
        vehicleType: true,
        state: true,
        createdAt: true,
      },
    });
  }),

  getVG: protectedProcedure.query(({ ctx }) => {
    return ctx.db.customPlate.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        plate: true,
        createdAt: true,
        description: true,
      },
    });
  }),

  updateAccount: protectedProcedure
    .input(FormSchemaAccount)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = FormSchemaAccount.parse(input);

        if (data.currentPlate) {
          const existingPlate = await ctx.db.user.findFirst({
            where: { currentPlate: data.currentPlate },
          });
          if (existingPlate && existingPlate.id !== ctx.session.user.id) {
            return NextResponse.json({
              user: null,
              message: "Email already exists.",
              status: 409,
            });
          }
        }

        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      return ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }),

  forgotPassword: publicProcedure
    .input(FormSchemaForgotPassword)
    .mutation(async ({ ctx, input }) => {
      try {
        const data_user = FormSchemaForgotPassword.parse(input);

        const resend = new Resend(process.env.RESEND_API_KEY);

        const existingUser = await ctx.db.user.findUnique({
          where: { email: data_user.email },
        });
        if (!existingUser) {
          return NextResponse.json({
            user: null,
            message: "Email doesnt exists.",
            status: 409,
          });
        }
        const token = randomBytes(32).toString("base64url");
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const { data, error } = await resend.emails.send({
          from: "Bumperpass Contact <contact@bumperpass.com>",
          to: existingUser.email ?? "",
          subject: "Password Reset",
          text: "Password Reset",
          react: EmailForgotPassword({
            name: existingUser.name ?? "",
            token: token,
          }),
        });
        if (error) {
          console.error(error);
        }
        console.log(data);

        return ctx.db.verificationToken.create({
          data: {
            token: token,
            expires: expiryDate,
            identifier: existingUser.id,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  updatePassword: publicProcedure
    .input(FormSchemaUpdatePassword)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = FormSchemaUpdatePassword.parse(input);
        console.log(data);
        if (data.token) {
          const verificationToken = await ctx.db.verificationToken.findUnique({
            where: {
              token: data.token,
            },
            include: {
              user: true,
            },
          });

          if (!verificationToken) {
            return NextResponse.json({
              user: null,
              message: "Invalid token.",
              status: 400,
            });
          }

          if (new Date() > verificationToken.expires) {
            return NextResponse.json({
              user: null,
              message: "Your token has expired.",
              status: 400,
            });
          }

          const hashedPassword = await hash(data.password, 10);

          const updatedUser = await ctx.db.user.update({
            where: {
              id: verificationToken.user.id,
            },
            data: {
              password: hashedPassword,
            },
          });

          if (updatedUser) {
            await ctx.db.verificationToken.deleteMany({
              where: {
                user: {
                  id: verificationToken.user.id,
                },
              },
            });
          }

          return NextResponse.json({
            user: updatedUser,
            message: "Password updated successfully.",
            status: 200,
          });
        } else {
          return NextResponse.json({
            user: null,
            message: "No token provided.",
            status: 400,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }),

  savePlate: protectedProcedure
    .input(
      z.object({
        plate: z.string(),
        available: z.boolean(),
        vehicleType: z.string(),
        state: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Accede al ID del usuario a través de la sesión
      const userId = ctx.session.user.id;

      // Primero, verifica si la placa ya existe
      const existingPlate = await ctx.db.plate.findUnique({
        where: { plate: input.plate },
      });

      if (existingPlate) {
        // Si la placa ya existe, devuelve su estado de disponibilidad
        return NextResponse.json(
          { message: "La placa ya existe", available: existingPlate.available },
          { status: 200 },
        );
      }

      // Si la placa no existe, la crea
      const newPlate = await ctx.db.plate.create({
        data: {
          plate: input.plate,
          available: input.available,
          userId: userId, // Usa el ID del usuario de la sesión
          createdAt: new Date(), // Guarda la fecha actual
          vehicleType: input.vehicleType, // Guarda el tipo de vehículo
          state: input.state, // Guarda el estado
        },
      });

      return newPlate;
    }),

  saveValidPlates: protectedProcedure
    .input(
      z.object({
        plates: z.array(z.string()),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Accede al ID del usuario a través de la sesión
      const userId = ctx.session.user.id;

      // Para cada placa válida, crea una nueva entrada en la tabla CustomPlate
      const createdPlates = await Promise.all(
        input.plates.map((plate) =>
          ctx.db.customPlate.create({
            data: {
              plate,
              userId,
              createdAt: new Date(), // Guarda la fecha actual
              description: input.description, // Usa el prompt proporcionado
            },
          }),
        ),
      );

      return createdPlates;
    }),
});
