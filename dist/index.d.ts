interface OdooConfig {
    url: string | undefined;
    db: string | undefined;
    username: string | undefined;
    password: string | undefined;
}
interface OdooClient {
    login: () => Promise<number | null>;
    call: (model: string, method: string, args?: any[], kwargs?: any) => Promise<any>;
    search: (model: string, domain: any[], kwargs?: any, context?: object) => Promise<any>;
    read: (model: string, ids: any[], fields?: any[], context?: object) => Promise<any>;
    get: (model: string, ids: any[], context?: object) => Promise<any>;
    write: (model: string, ids: any[], values: any) => Promise<any>;
    create: (model: string, values: any) => Promise<any>;
    unlink: (model: string, ids: any[]) => Promise<any>;
    fieldsGet: (model: string, kwargs?: any) => Promise<any>;
    nameGet: (model: string, ids: any[]) => Promise<any>;
    nameSearch: (model: string, name: string, operator?: string, kwargs?: any) => Promise<any>;
    nameCreate: (model: string, name: string) => Promise<any>;
    defaultGet: (model: string, fields: any[]) => Promise<any>;
    onChange: (model: string, ids: any[], method: string, args: any[]) => Promise<any>;
    workflowSignal: (model: string, ids: any[], signal: string) => Promise<any>;
    searchRead: (model: string, domain: any[], fields?: any[], kwargs?: any, context?: object) => Promise<any>;
    filterGetResults: any;
}
declare function createOdooClient(config?: OdooConfig): OdooClient;
export { createOdooClient };
