import path from 'path';
import prompts from 'prompts';
import CreateAccount from './CreateAccount';
import Transfer from './Transfer';
import TransferExternal from './TransferExternal';

const methods = {
  CreateAccount,
  Transfer,
  TransferExternal,
}

const selectMethods = async () => {
  const response = await prompts({
    type: 'select',
    name: 'method',
    min: 1,
    message: 'Select method to execute',
    choices: Object.keys(methods).map((key) => ({
      title: key,
      value: key,
      disabled: false,
      selected: false
      // description: `Execute key ${key}`
    }))
  })
  return response.method as keyof typeof methods
}

selectMethods().then(async (method) => {
  console.log(`Executing ${method}`)
  const result = methods[method]() as Promise<any> | void
  if (result instanceof Promise) {
    await result.catch((error) => console.error(error.message))
  }
  console.log('Open this file to see full script:', path.join(process.cwd(), `${method}.ts`))
  process.exit(0)
})

// prevent the process from exiting
setInterval(() => void 0, 1000)