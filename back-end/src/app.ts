import express, { type Express } from "express";
import { Server as HttpServer, createServer } from "http";
import cors from "cors";
import { AuthRoutes } from "./routes/auth.routes";
import { HttpStatus } from "./utils/http-status.enum";
import morgan from "morgan";
import { BlogRoutes } from "./routes/blog.routes";

export class App {
  public app: Express;
  public server: HttpServer;
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(morgan("dev"));

    const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:4200"];

    const corsOptions = {
      origin: (origin: string | undefined, callback: Function) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    };
    this.app.use(cors(corsOptions));
  }

  public setupRoutes(authRoutes: AuthRoutes, blogRoutes: BlogRoutes): void {
    this.app.use("/auth", authRoutes.getRouter());
    this.app.use("/blogs", blogRoutes.getRouter());
    this.app.get("/health", (req, res) => {
      res
        .status(HttpStatus.SUCCESS)
        .send({ status: HttpStatus.SUCCESS, uptime: process.uptime() });
    });
  }

  public getServer() {
    return this.server;
  }
}
