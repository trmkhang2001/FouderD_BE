"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const leads_repository_1 = require("./leads.repository");
let LeadsService = class LeadsService {
    leads;
    constructor(leads) {
        this.leads = leads;
    }
    list(user, query) {
        if (user.role === client_1.Role.SALE) {
            return this.leads.findManyForRole({
                saleId: user.sub,
                skip: query.skip,
                take: query.take ?? 50,
            });
        }
        return this.leads.findManyForRole({
            saleId: query.saleId,
            skip: query.skip,
            take: query.take ?? 50,
        });
    }
    async getOne(user, id) {
        const lead = await this.leads.findById(id);
        if (!lead) {
            throw new common_1.NotFoundException();
        }
        if (user.role === client_1.Role.SALE && lead.saleId !== user.sub) {
            throw new common_1.ForbiddenException();
        }
        return lead;
    }
    async delete(user, id) {
        const lead = await this.leads.findById(id);
        if (!lead) {
            throw new common_1.NotFoundException();
        }
        if (user.role === client_1.Role.SALE && lead.saleId !== user.sub) {
            throw new common_1.ForbiddenException('You can only delete your own leads');
        }
        return this.leads.deleteById(id);
    }
    async update(user, id, input) {
        const lead = await this.leads.findById(id);
        if (!lead) {
            throw new common_1.NotFoundException();
        }
        if (user.role === client_1.Role.SALE && lead.saleId !== user.sub) {
            throw new common_1.ForbiddenException('You can only edit your own leads');
        }
        return this.leads.updateById(id, {
            name: input.name,
            source: input.source,
            tag: input.tag,
            status: input.status,
            dealAmount: input.dealAmount,
            lastActivityAt: new Date(),
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leads_repository_1.LeadsRepository])
], LeadsService);
//# sourceMappingURL=leads.service.js.map