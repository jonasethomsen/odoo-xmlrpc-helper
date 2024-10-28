"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOdooClient = void 0;
const xmlrpc_1 = require("@foxglove/xmlrpc");
const configUrl = process.env.ODOO_URL;
const configDB = process.env.ODOO_DB;
const configUsername = process.env.ODOO_USERNAME;
const configPassword = process.env.ODOO_PASSWORD;
function parseDomain(input) {
    if (input === undefined) {
        return null; // Or however you want to handle undefined input
    }
    let domain = input
        .replace(/'/g, '"') // replace single quotes with double quotes for JSON parsing
        .replace(/\(/g, "[") // replace open parenthesis with open square bracket
        .replace(/\)/g, "]") // replace close parenthesis with close square bracket
        .replace(/True/g, "true") // replace Python True with JSON true
        .replace(/False/g, "false") // replace Python False with JSON false
        .replace(/(\\n)/g, "")
        .replace(/(\\r)/g, "")
        .replace(/(\\t)/g, "")
        .replace(/(\\f)/g, "")
        .replace(/(\\b)/g, "")
        .replace(/("{)/g, "{")
        .replace(/(}")/g, "}")
        .replace(/(\")/g, '"')
        .replace(/(\\)/g, "")
        .replace(/(\/)/g, "/");
    try {
        return JSON.parse(domain);
    }
    catch (e) {
        console.error("Failed to parse domain:", e);
        return null; // Or however you want to handle parsing failures
    }
}
function createOdooClient(config) {
    config = config !== null && config !== void 0 ? config : {
        url: configUrl,
        db: configDB,
        username: configUsername,
        password: configPassword,
    };
    const url = config.url;
    const db = config.db;
    const username = config.username;
    const password = config.password;
    const commonClient = new xmlrpc_1.XmlRpcClient(`${url}/xmlrpc/2/common`);
    const objectClient = new xmlrpc_1.XmlRpcClient(`${url}/xmlrpc/2/object`);
    let uid = null;
    function login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uid) {
                // @ts-ignore
                uid = yield commonClient.methodCall("authenticate", [
                    db,
                    username,
                    password,
                    {},
                ]);
            }
            return uid;
        });
    }
    function call(model, method, args = [], kwargs = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield login();
            return yield objectClient.methodCall("execute_kw", [
                db,
                uid,
                password,
                model,
                method,
                args,
                kwargs,
            ]);
        });
    }
    function search(model, domain, kwargs = {}, context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "search", [domain], Object.assign(Object.assign({}, kwargs), { context }));
        });
    }
    function searchCount(model, domain, context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "search_count", [domain], { context });
        });
    }
    function read(model, ids, fields = [], context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "read", [ids, fields], { context });
        });
    }
    function get(model, ids, context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "read", [ids], { context });
        });
    }
    function write(model, ids, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "write", [ids, values]);
        });
    }
    function create(model, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "create", [values]);
        });
    }
    function unlink(model, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "unlink", [ids]);
        });
    }
    function fieldsGet(model, kwargs = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "fields_get", [], kwargs);
        });
    }
    function nameGet(model, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "name_get", [ids]);
        });
    }
    function nameSearch(model, name, operator = "ilike", kwargs = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "name_search", [name, operator], kwargs);
        });
    }
    function nameCreate(model, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "name_create", [name]);
        });
    }
    function defaultGet(model, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, "default_get", [fields]);
        });
    }
    function onChange(model, ids, method, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield call(model, method, [ids].concat(args));
        });
    }
    function workflowSignal(model, ids, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield login();
            return yield commonClient.methodCall("exec_workflow", [
                db,
                uid,
                password,
                model,
                signal,
                ids[0],
            ]);
        });
    }
    function searchRead(model, domain, fields = [], kwargs = {}, context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield call(model, "search_read", [domain, fields], Object.assign(Object.assign({}, kwargs), { context }));
            return data;
        });
    }
    function filterGetResults(filterId, fields, kwargs = {}, context = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response_filter = (yield get("ir.filters", [
                parseInt(filterId),
            ]));
            const response_filter_data = response_filter[0];
            // return response_filter_data;
            const response_filter_domain = parseDomain(response_filter_data.domain);
            const data = yield searchRead(response_filter_data.model_id, response_filter_domain, fields, kwargs, context);
            return data;
        });
    }
    return {
        login,
        call,
        search,
        searchCount,
        read,
        get,
        write,
        create,
        unlink,
        fieldsGet,
        nameGet,
        nameSearch,
        nameCreate,
        defaultGet,
        onChange,
        workflowSignal,
        searchRead,
        filterGetResults,
    };
}
exports.createOdooClient = createOdooClient;
