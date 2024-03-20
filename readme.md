# Odoo XML-RPC Helper Module Documentation

## Overview

The Odoo XML-RPC Helper is a TypeScript-based module designed to facilitate seamless integration with Odoo's XML-RPC API. It simplifies the process of performing various operations such as CRUD, custom API calls, and authentication within a TypeScript project.

## Features

- **Simplified Authentication:** Streamlines the login process to the Odoo instance.
- **CRUD Operations:** Supports Create, Read, Update, and Delete operations on Odoo models.
- **Custom API Calls:** Enables calling custom methods defined in Odoo models.
- **Enhanced Type Safety:** Utilizes TypeScript for improved code reliability and maintainability.

## Prerequisites

- Node.js
- Access to an Odoo instance with XML-RPC API enabled

## Installation

This module is private and hosted on GitHub. Install it using npm by replacing `your-username` and `your-repo` with your GitHub credentials:

```
npm install git+https://github.com/your-username/your-repo.git#semver:^1.0.0
```

## Setup

Configure your environment with the Odoo instance details:

```typescript
import { createOdooClient } from 'odoo-xmlrpc-helper';

const client = createOdooClient({
  url: 'http://your-odoo-instance.com',
  db: 'your-database',
  username: 'your-username',
  password: 'your-password'
});
```

## API Methods

### `login(): Promise<number | null>`

Authenticates the user and retrieves the user ID.

### `call(model: string, method: string, args?: any[], kwargs?: any): Promise<any>`

Calls a custom method on an Odoo model.

### `search(model: string, domain: any[], kwargs?: any, context?: object): Promise<any>`

Searches for records in an Odoo model based on a domain.

### `read(model: string, ids: any[], fields?: any[], context?: object): Promise<any>`

Reads specified fields from records in an Odoo model.

### `write(model: string, ids: any[], values: any): Promise<any>`

Updates records in an Odoo model.

### `create(model: string, values: any): Promise<any>`

Creates a new record in an Odoo model.

### `unlink(model: string, ids: any[]): Promise<any>`

Deletes records from an Odoo model.

## Example Usage

Here is an example of how to use the module to perform a login and fetch partners marked as companies:

```typescript
async function exampleUsage() {
  const uid = await client.login();
  const partners = await client.search('res.partner', [['is_company', '=', true]]);
  const partnerData = await client.read('res.partner', partners, ['name', 'country_id', 'comment']);
  return partnerData;
}

let contactsFromOdooWhereCompanyIsTrue = exampleUsage();

```
