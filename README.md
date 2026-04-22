# Nomba Developer Documentation

The official developer documentation for the Nomba API, built with [Mintlify](https://mintlify.com).

---

## Running the Docs locally

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify):

```bash
npm i -g mintlify
```

Run the dev server from the root of the repo (where `docs.json` is):

```bash
mintlify dev
```

#### Troubleshooting

- **Mintlify dev isn't running** — Run `mintlify install` to re-install dependencies.
- **Page loads as a 404** — Make sure you are running from the folder that contains `docs.json`.

---

## Publishing Changes

Install the Mintlify GitHub App to auto-deploy changes from this repo. Changes pushed to the default branch are deployed to production automatically. Find the installation link on your Mintlify dashboard.
