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

## Security Best Practices

When integrating with Odoo or any external system, it's paramount to handle authentication credentials securely. We strongly recommend using **environment variables** to manage your Odoo instance URL, database name, username, and password. Storing these sensitive details in environment variables, rather than hardcoding them into your application, offers several advantages:

- **Security:** Environment variables keep sensitive information out of your codebase, reducing the risk of exposing credentials in version control systems.
- **Flexibility:** It's easier to update credentials or configuration details without changing the application code, facilitating a smoother deployment process across different environments (development, testing, production).
- **Portability:** Using environment variables supports the twelve-factor app methodology, making your application more portable and easier to configure in various environments.

To set up environment variables, you can use your operating system's method for defining them, or leverage dotenv files (`.env`) in combination with libraries like `dotenv` for Node.js applications. Here's an example of how you might configure these in a `.env` file:

```
ODOO_URL=http://your-odoo-instance.com
ODOO_DB=your-database
ODOO_USERNAME=your-username
ODOO_PASSWORD=your-password
```

Ensure your application loads these environment variables at runtime, and then use them to configure your Odoo XML-RPC Helper client as shown in the setup section of this documentation. By following these practices, you enhance the security and maintainability of your application.

## Example Usage

Here is an example of how to use the module to perform a login and fetch partners marked as companies:

```typescript
import { createOdooClient } from 'odoo-xmlrpc-helper';

const client = createOdooClient({
  // *** PLEASE USE ENVIRONMENT VARIABLES AT ALL TIMES. *** //
  // *** THE EXPLICIT CONFIG BELOW IS PURELY EDUCATIONAL. *** //
  url: 'http://your-odoo-instance.com',
  db: 'your-database',
  username: 'your-username',
  password: 'your-password'
});

async function exampleUsage() {
  const domain = [['is_company', '=', true]];
  const fields = ['name', 'country_id', 'comment'];
  
  // Using searchRead to fetch companies
  const partnerData = await client.searchRead('res.partner', domain, fields);
  return partnerData;
}

let contactsFromOdooWhereCompanyIsTrue = exampleUsage();
```
