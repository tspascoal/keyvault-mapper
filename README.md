# Azure Keyvault keys mapper

Dynamically map key vault secrets obtained using the [Azure/get-keyvault-secrets](https://github.com/Azure/get-keyvault-secrets) action.

This allows you to have different keys on keyvault (exempl with a dynamic preffix or a variable type) in the name and map them to fixed names so you can use it on your workflow with a fixed name without having to change your keyvault secret names.

The map is defined in JSON. It's an array of maps, whereas each element has a key and a value. The key represents the secret name in key vault and value is the name of the secret to be mapped.

eg:

```JSON
[
  {"KV_SECRET_NAME1" : "MAPPED_KEY1"},
  {"KV_SECRET_NAME2" : "MAPPED_KEY2"}
]
```

In this example a secret in keyvault with the name `KV_SECRET_NAME1` will be available as the output of this action as `MAPPED_KEY1`

## Usage

The action supports two distinct operations

### keys

This operation allows you to get the keys to be passed [Azure/get-keyvault-secrets] action, this way you just need to define the keys on the map.

```YAML
env:
  # Maps secret names in key vault with preffix-ENVIRONNEMT-VARNAME to VARNAME
  kvMap: |
    [
      {"preffix-${{ github.event.inputs.environment_type }}-var1":"var1"},
      {"preffix-${{ github.event.inputs.environment_type }}-var2":"var2"}
    ]

steps:
  # Get the keys to be fetched from keyvault
  - name: Get KV keys list
    uses: tspascoal/keyvault-mapper@v1
    id: kvKeys
    with:
      operation: keys
      map: ${{ env.kvMap }}

  - name: Azure key vault - Get Secrets
      uses: Azure/get-keyvault-secrets@v1
      id: keyVaultSecrets
      with:
        keyvault: your-keyvault-name
        secrets: ${{ steps.kvKeys.outputs.keys }}
```

### map

This operations maps value from keyvault based on the mapping so you can use them statically in your workflow.

The secrets passed from the `Azure/get-keyvault-secrets` action will be available in the ouputs of this action, and the name of the
output(s) will be the mapped key.

```YAML
env:
  # Maps secret names in key vault with preffix-ENVIRONNEMT-VARNAME to VARNAME
  kvMap: |
    [
      {"preffix-${{ github.event.inputs.environment_type }}-var1":"var1"},
      {"preffix-${{ github.event.inputs.environment_type }}-var2":"var2"}
    ]

steps:
  # Get the keys to be fetched from keyvault
  - name: Get KV keys list
    uses: tspascoal/keyvault-mapper@v1
    id: kvKeys
    with:
      operation: keys
      map: ${{ env.kvMap }}

  - name: Azure key vault - Get Secrets
    uses: Azure/get-keyvault-secrets@v1
    id: fetchKeyVaultSecrets
    with:
      keyvault: your-keyvault-name
      secrets: ${{ steps.kvKeys.outputs.keys }}

  - name: Map secrets
    uses: tspascoal/keyvault-mapper@v1
    id: keyVaultSecrets
    with:
      operation: keys
      map: ${{ env.kvMap }}
      secrets: ${{ toJSON(steps.fetchKeyVaultSecrets.outputs) }}

  # Now you can use the secrets directly with the fixed name
  - run: ./usescripts.sh
    env:
      VAR1: ${{ steps.keyVaultSecrets.outputs.var1 }}

```
