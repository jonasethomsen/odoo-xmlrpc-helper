# Odoo Client TypeScript Module

This is a private module that provides a TypeScript client for interacting with the Odoo XML-RPC API.

## Features

- Authentication
- CRUD Operations
- Custom API Calls
- Type Safety with TypeScript

## Requirements

- Node.js
- Odoo instance with XML-RPC enabled

## Installation

Since this package is hosted privately on GitHub, you can install it using:

```bash
npm install git+https://github.com/your-username/your-repo.git#semver:^1.0.0
```

Replace `your-username` and `your-repo` with the appropriate GitHub username and repository name. Adjust the semver tag as needed.

## Usage

First, make sure you have environment variables or configurations set up for the Odoo instance you're connecting to.

```javascript
import { createOdooClient } from 'odoo-client-ts';

const client = createOdooClient({
  url: 'http://localhost:8069',
  db: 'my_database',
  username: 'admin',
  password: 'password'
});

async function exampleUsage() {
  const uid = await client.login();
  const partners = await client.search('res.partner', [['is_company', '=', true]]);
  const partnerData = await client.read('res.partner', partners, ['name', 'country_id', 'comment']);
  console.log(partnerData);
}

exampleUsage();
```

## Testing

This module includes unit tests. Run the tests with:

```bash
npm test
```

## Contributing

This is a private package, so contributions are not accepted.

## License

This package is for internal usage only and is not licensed for external distribution.