import { Request, Response, NextFunction,  } from "express";

export function errorHandler(err: unknown , req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const error = err as {
    statusCode?: number;
    message?: string;
    errors?: any;
    stack?: string;
  };
  
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
      errors: error.errors || null,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
}

