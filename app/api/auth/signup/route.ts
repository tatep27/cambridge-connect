import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { errorResponse, badRequestResponse, createdResponse } from "@/lib/api-client/route-handlers";

/**
 * POST /api/auth/signup
 * Creates a new user account
 * 
 * Request body:
 * - email: string (required)
 * - password: string (required, min 8 chars)
 * - name: string (required)
 * 
 * Response:
 * - 201: User created successfully
 * - 400: Invalid request (missing fields, invalid email, password too short)
 * - 409: Email already exists
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return badRequestResponse("Email, password, and name are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequestResponse("Invalid email format");
    }

    // Validate password length
    if (password.length < 8) {
      return badRequestResponse("Password must be at least 8 characters");
    }

    // Validate name
    if (name.trim().length === 0) {
      return badRequestResponse("Name cannot be empty");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            message: "Email already registered",
            code: "EMAIL_EXISTS",
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (organizationId is null initially, will be set during onboarding)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name.trim(),
        organizationId: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        organizationId: true,
        createdAt: true,
      },
    });

    return createdResponse(user);
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("Failed to create account", 500);
  }
}

