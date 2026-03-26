import { DashboardService } from "../services/dashboard.service.js";
import { ok } from "../lib/http.js";
const service = new DashboardService();
export async function dashboard(_req, res) {
    const data = await service.getSummary();
    return res.json(ok(data));
}
