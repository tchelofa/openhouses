import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  urlAvatar: z.string().url("Invalid URL").nullable().optional(),
  description: z.string().nullable().optional(),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  address: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  county: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postcode: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  loginAttempt: z.number().nonnegative().default(0),
  accountStatus: z.enum(["Activated", "Inactivated"]).default("Activated"),
  accountType: z.enum(["TENANT", "ADVISOR"]).default("TENANT"),
  acceptMarketing: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  passwordUpdatedAt: z.date().optional(),
});

export const PropertySchema = z.object({
  title: z.string(),
  description: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  county: z.string(),
  country: z.string().default("Ireland"),
  postcode: z.string(),
  price: z.string(),
  propertyType: z.enum(["FLAT", "HOUSE", "SINGLEROOM", "SHAREDROOM", "DOUBLEROOM"]),
  rooms: z.string(),
  capacity: z.string(),
  toilets: z.string(),
  externalArea: z.string(),
  electricityFee: z.string(),
  wifiFee: z.string(),
  rubbishFee: z.string(),
  depositFee: z.string(),
  timeRefundDeposit: z.string(),
  availableAtInit: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  availableAtEnd: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  userId: z.string(),
  businessType: z.enum(["SELL", "RENT"])
});

export const PartialPropertySchema = PropertySchema.partial();

export const PropertyImgsSchema = z.object({
  url: z.string().url("Invalid URL"),
  propertyId: z.number().int().positive()
});

export const logsLoginSchema = z.object({
  ipAddress: z.string().ip("Invalid IP address"),
  loginStatus: z.enum(["Accept", "Deny"]),
  userId: z.number().int().positive()
});

export const verifyTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
  type: z.enum(["ACTIVATION", "RESET"]),
  expiration: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  isUsed: z.boolean().default(false),
  userId: z.number().int().positive()
});

export const MessageSchema = z.object({
  userFromId: z.string(),
  userToId: z.string(),
  message: z.string().min(1, "Message is required"),
  status: z.enum(["SENT", "READ"]),
});
