import { Request, Response } from "express";
import { prisma } from "..";

// 내 주문서 목록 조회
export const getMyOrderRequest = async (req: Request, res: Response) => {
  const buyerId = req.user?.id;
  const { page = 1, limit = 10, sortBy = "latest" } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const orderRequests = await prisma.orderRequest.findMany({
    where: {
      buyerId,
    },
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: sortBy === "latest" ? "desc" : "asc",
    },
    include: {
      buyer: {
        select: {
          username: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      subcategory: {
        select: {
          name: true,
        },  
      },
    },
  });

  const totalItems = await prisma.orderRequest.count({
    where: {
      buyerId,
    },
  });

  const totalPages = Math.ceil(totalItems / Number(limit));

  res.status(200).json({
    orderRequests: orderRequests.map((order) => ({
      ...order,
      buyer: { name: order.buyer?.username },
      createdAt: order.createdAt.toISOString(),
      deadline: order.deadline?.toISOString() || null,
    })),
    totalPages,
    totalItems,
  });
};
