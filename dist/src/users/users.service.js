"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const users_repository_1 = require("./users.repository");
let UsersService = class UsersService {
    users;
    constructor(users) {
        this.users = users;
    }
    list() {
        return this.users.listForAdmin();
    }
    async create(input) {
        const existing = await this.users.findByEmail(input.email);
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const password = await bcrypt.hash(input.password, 12);
        return this.users.create({
            email: input.email,
            password,
            name: input.name,
            role: input.role,
            saleAccId: input.saleAccId,
        });
    }
    async getOne(id) {
        const user = await this.users.findById(id);
        if (!user) {
            throw new common_1.NotFoundException();
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            saleAccId: user.saleAccId,
            createdAt: user.createdAt,
        };
    }
    async update(id, input) {
        const existing = await this.users.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException();
        }
        let saleAccId = existing.saleAccId;
        if (existing.saleAccId) {
            if (input.saleAccId !== undefined &&
                input.saleAccId !== null &&
                input.saleAccId !== existing.saleAccId) {
                throw new common_1.BadRequestException('Sale ACC ID đã được gán, không thể thay đổi.');
            }
        }
        else {
            saleAccId = input.saleAccId ?? null;
        }
        if (input.email !== existing.email) {
            const taken = await this.users.findByEmail(input.email);
            if (taken && taken.id !== id) {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        const passwordPlain = input.password?.trim();
        let passwordHash;
        if (passwordPlain) {
            passwordHash = await bcrypt.hash(passwordPlain, 12);
        }
        return this.users.update(id, {
            role: input.role,
            email: input.email,
            name: input.name,
            saleAccId,
            ...(passwordHash && { password: passwordHash }),
        });
    }
    async remove(id, requesterId) {
        if (id === requesterId) {
            throw new common_1.BadRequestException('Không thể xóa chính tài khoản đang đăng nhập.');
        }
        const existing = await this.users.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException();
        }
        try {
            await this.users.deleteById(id);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2003') {
                    throw new common_1.ConflictException('Không xóa được: còn ràng buộc dữ liệu (DB). Chạy prisma migrate deploy trên VPS hoặc xóa dữ liệu liên quan trước.');
                }
            }
            throw e;
        }
        return { ok: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map