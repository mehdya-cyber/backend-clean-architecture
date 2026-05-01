import { tryCatchAsync } from "../../../core/utils/try-catch-async";
import { Request, Response } from "express";
import { AuthUseCases } from "../../../application/use-cases/auth/auth.use-cases";
import { AuthMapper } from "../../mappers/auth.mapper";
import {
  TLoginRequestDto,
  TRegisterRequestDto,
} from "../dtos/auth/auth-request.dto";
import {
  TLoginCommand,
  TRegisterCommand,
} from "../../../application/commands/auth/auth.command";
import { injectable, inject } from "inversify";
import { CONTAINER_TYPES } from "../../../core/container/container.types";
import { getRequestMeta } from "../../../core/utils/get-request-meta";
import { CookieService } from "../../../core/utils/cookies";
import { AppError } from "../../../core/error/app-error";

@injectable()
export class AuthController {
  constructor(
    @inject(CONTAINER_TYPES.AuthUseCases)
    private readonly authUseCases: AuthUseCases,
  ) {}

  login = tryCatchAsync(async (req: Request, res: Response) => {
    const dto: TLoginRequestDto = req.body;

    const { ip, userAgent } = getRequestMeta(req);

    const command: TLoginCommand = {
      email: dto.email,
      password: dto.password,
      ipAddress: ip,
      userAgent: userAgent,
    };

    const { accessToken, refreshToken, user, csrfToken } =
      await this.authUseCases.loginUseCase(command);

    CookieService.setRefreshToken(res, refreshToken);
    CookieService.setCSRFToken(res, csrfToken);

    const userResponse = AuthMapper.toLoginResponse(user, accessToken);

    return res.status(200).json({ success: true, data: userResponse });
  });

  register = tryCatchAsync(async (req: Request, res: Response) => {
    const dto: TRegisterRequestDto = req.body;
    const { ip, userAgent } = getRequestMeta(req);

    const command: TRegisterCommand = {
      email: dto.email,
      password: dto.password,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      ipAddress: ip,
      userAgent: userAgent,
    };

    const { accessToken, refreshToken, user, csrfToken } =
      await this.authUseCases.registerUseCase(command);

    CookieService.setRefreshToken(res, refreshToken);
    CookieService.setCSRFToken(res, csrfToken);

    const userResponse = AuthMapper.toRegisterResponse(user, accessToken);

    return res.status(201).json({ success: true, data: userResponse });
  });

  refresh = tryCatchAsync(async (req: Request, res: Response) => {
    const { ip, userAgent } = getRequestMeta(req);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Token not found", 400);
    }

    const command = {
      refreshToken: refreshToken,
      ipAddress: ip ?? null,
      userAgent: userAgent,
    };

    let result;
    try {
      result = await this.authUseCases.refresh(command);
    } catch (err) {
      CookieService.clearRefreshToken(res);
      CookieService.clearCSRFToken(res);
      throw err;
    }

    CookieService.setRefreshToken(res, result.refreshToken);
    CookieService.setCSRFToken(res, result.csrfToken);

    const userResponse = AuthMapper.toRefreshResponse(
      result.user,
      result.accessToken,
    );

    return res.status(200).json({ success: true, data: userResponse });
  });

  logout = tryCatchAsync(async (req: Request, res: Response) => {
    const { ip } = getRequestMeta(req);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Token not found", 400);
    }

    const command = {
      refreshToken: refreshToken,
      ipAddress: ip ?? null,
    };

    const result = await this.authUseCases.logout(command);

    CookieService.clearRefreshToken(res);
    CookieService.clearCSRFToken(res);

    return res.status(200).json({ success: result, data: { loggedOut: true } });
  });

  logoutAll = tryCatchAsync(async (req: Request, res: Response) => {
    const { ip } = getRequestMeta(req);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const command = {
      userId,
      ip: ip ?? null,
    };

    const result = await this.authUseCases.logoutAll(command);

    CookieService.clearRefreshToken(res);
    CookieService.clearCSRFToken(res);

    return res.status(200).json({ success: result, data: { loggedOut: true } });
  });
}
