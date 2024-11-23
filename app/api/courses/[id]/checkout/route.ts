import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.id,
        isPublished: true,
      },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const isPurchased = await db.purchase.findUnique({
      where: {
        courseId_userId: {
          courseId: params.id,
          userId: user.id,
        },
      },
    });

    if (isPurchased) {
      return new NextResponse("Course already Purchased", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: course.price! * 100,
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const newCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: newCustomer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.id}?canceled=1`,
      metadata: {
        courseId: params.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
