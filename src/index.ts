import { XmlRpcClient } from "@foxglove/xmlrpc";

const configUrl = process.env.ODOO_URL;
const configDB = process.env.ODOO_DB;
const configUsername = process.env.ODOO_USERNAME;
const configPassword = process.env.ODOO_PASSWORD;

interface OdooConfig {
  url: string | undefined;
  db: string | undefined;
  username: string | undefined;
  password: string | undefined;
}

interface OdooClient {
  login: () => Promise<number | null>;
  call: (
    model: string,
    method: string,
    args?: any[],
    kwargs?: any
  ) => Promise<any>;
  search: (
    model: string,
    domain: any[],
    kwargs?: any,
    context?: object
  ) => Promise<any>;
  searchCount: (model: string, domain: any[], context?: object) => Promise<any>;
  read: (
    model: string,
    ids: any[],
    fields?: any[],
    context?: object
  ) => Promise<any>;
  get: (model: string, ids: any[], context?: object) => Promise<any>;
  write: (model: string, ids: any[], values: any) => Promise<any>;
  create: (model: string, values: any) => Promise<any>;
  unlink: (model: string, ids: any[]) => Promise<any>;
  fieldsGet: (model: string, kwargs?: any) => Promise<any>;
  nameGet: (model: string, ids: any[]) => Promise<any>;
  nameSearch: (
    model: string,
    name: string,
    operator?: string,
    kwargs?: any
  ) => Promise<any>;
  nameCreate: (model: string, name: string) => Promise<any>;
  defaultGet: (model: string, fields: any[]) => Promise<any>;
  onChange: (
    model: string,
    ids: any[],
    method: string,
    args: any[]
  ) => Promise<any>;
  workflowSignal: (model: string, ids: any[], signal: string) => Promise<any>;
  searchRead: (
    model: string,
    domain: any[],
    fields?: any[],
    kwargs?: any,
    context?: object
  ) => Promise<any>;
  filterGetResults: any;
}

function parseDomain(input: string | undefined): any {
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
  } catch (e) {
    console.error("Failed to parse domain:", e);
    return null; // Or however you want to handle parsing failures
  }
}

function createOdooClient(config?: OdooConfig): OdooClient {
  config = config ?? {
    url: configUrl,
    db: configDB,
    username: configUsername,
    password: configPassword,
  };

  const url = config.url;
  const db = config.db;
  const username = config.username;
  const password = config.password;

  const commonClient = new XmlRpcClient(`${url}/xmlrpc/2/common`);
  const objectClient = new XmlRpcClient(`${url}/xmlrpc/2/object`);
  let uid: number | null = null;

  async function login() {
    if (!uid) {
      // @ts-ignore
      uid = await commonClient.methodCall("authenticate", [
        db,
        username,
        password,
        {},
      ]);
    }
    return uid;
  }

  async function call(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: any = {}
  ) {
    const uid = await login();
    return await objectClient.methodCall("execute_kw", [
      db,
      uid,
      password,
      model,
      method,
      args,
      kwargs,
    ]);
  }

  async function search(
    model: string,
    domain: any[],
    kwargs: any = {},
    context: any = {}
  ) {
    return await call(model, "search", [domain], { ...kwargs, context });
  }

  async function searchCount(model: string, domain: any[], context: any = {}) {
    return await call(model, "search_count", [domain], { context });
  }

  async function read(
    model: string,
    ids: any[],
    fields: any[] = [],
    context: any = {}
  ) {
    return await call(model, "read", [ids, fields], { context });
  }
  async function get(model: string, ids: any[], context: any = {}) {
    return await call(model, "read", [ids], { context });
  }

  async function write(model: string, ids: any[], values: any) {
    return await call(model, "write", [ids, values]);
  }

  async function create(model: string, values: any) {
    return await call(model, "create", [values]);
  }

  async function unlink(model: string, ids: any[]) {
    return await call(model, "unlink", [ids]);
  }

  async function fieldsGet(model: string, kwargs: any = {}) {
    return await call(model, "fields_get", [], kwargs);
  }

  async function nameGet(model: string, ids: any[]) {
    return await call(model, "name_get", [ids]);
  }

  async function nameSearch(
    model: string,
    name: string,
    operator = "ilike",
    kwargs: any = {}
  ) {
    return await call(model, "name_search", [name, operator], kwargs);
  }

  async function nameCreate(model: string, name: string) {
    return await call(model, "name_create", [name]);
  }

  async function defaultGet(model: string, fields: any[]) {
    return await call(model, "default_get", [fields]);
  }

  async function onChange(
    model: string,
    ids: any[],
    method: string,
    args: any[]
  ) {
    return await call(model, method, [ids].concat(args));
  }

  async function workflowSignal(model: string, ids: any[], signal: string) {
    const uid = await login();
    return await commonClient.methodCall("exec_workflow", [
      db,
      uid,
      password,
      model,
      signal,
      ids[0],
    ]);
  }

  async function searchRead(
    model: string,
    domain: any[],
    fields: any[] = [],
    kwargs: any = {},
    context: any = {}
  ) {
    const data = await call(model, "search_read", [domain, fields], {
      ...kwargs,
      context,
    });
    return data;
  }

  async function filterGetResults(
    filterId: string,
    fields: string[],
    kwargs: any = {},
    context: any = {}
  ) {
    const response_filter = (await get("ir.filters", [
      parseInt(filterId),
    ])) as any;
    const response_filter_data = response_filter[0];
    // return response_filter_data;
    const response_filter_domain = parseDomain(response_filter_data.domain);
    const data = await searchRead(
      response_filter_data.model_id,
      response_filter_domain,
      fields,
      kwargs,
      context
    );
    return data;
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

export { createOdooClient };
